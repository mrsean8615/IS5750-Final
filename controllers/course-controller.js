const Course = require('../models/course-model');
const User = require('../models/user-model');
const Trainer = require('../models/trainer-model');
const mongoose = require('mongoose');

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('trainer')
        
        
    res.render('courses', { title: 'Courses', courses });
    } catch (err) {
        err.message = 'Error fetching courses. Please try again.'; 
        next(err)
    }
}

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({titleSlug: req.params.titleSlug})
            .populate('trainer')
        res.render('course-details', { title: course.title, course });

        if (!course) {
            return res.status(404).render('404', { title: 'Course Not Found' });
        }
    } catch (err) {
        err.message = 'Error fetching course details. Please try again.'; 
        next(err)
    }
}

exports.getTop3Courses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('trainer')
            .sort({ likes: -1 })
            .limit(3)
        return courses
    } catch (err) {
        err.message = 'Error fetching top courses. Please try again.'; 
        next(err)
    }
}

exports.getRegisterCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({titleSlug: req.params.titleSlug})
            .populate('trainer')


        const courses = await Course.find()
            .populate('trainer')
            .sort('title')

        res.render('course-registration', { title: 'Course Registration', courses, course, user: req.session.user });

        if (!courses) {
            return res.status(404).render('404', { title: 'Course Not Found' });
        }
    } catch (err) {
        err.message = 'Error fetching course registration. Please try again.'; 
        next(err)
    }
}

exports.postRegisterCourse = async (req, res, next) => {
    const { courseId, userId, courseTitle } = req.body;

    try {
        const course = await Course.findById(courseId);
        
        if (!course) {
            req.flash('error', 'Course not found. Please try again.');
            return res.redirect('/courses/' + courseTitle + '/register');
        }

        if (course.registrants.includes(userId)) {
            req.flash('error', 'You are already registered for this course.');
            return res.redirect('/courses/' + courseTitle + '/register');
        }

        if (course.capacity <= 0) {
            req.flash('error', 'Course is at full capacity.');
            return res.redirect('/courses/' + courseTitle + '/register');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                { 
                    $addToSet: { registrants: userId },
                    $inc: { capacity: -1 }
                },
                { new: true, session }
            );

            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { courses: courseId } },
                { session }
            );

            await session.commitTransaction();
            res.redirect('/courses/' + courseTitle + '/register');
            req.flash('success', 'You have successfully registered for the course!');

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch(err) {
        err.message = 'Error registering for course. Please try again.'; 
        next(err)
    }
}

exports.postUnregisterCourse = async (req, res, next) => {
    const { courseId, userId, courseTitle } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            req.flash('error', 'Course not found. Please try again.');
            return res.redirect('/courses/' + courseTitle);
        }
        if (!course.registrants.includes(userId)) {
            req.flash('error', 'You are not registered for this course.');
            return res.redirect('/courses/' + courseTitle + '/register');
        }

        // had problems with double inputs on db. Learned about start session to fix problem
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                { 
                    $pull: { registrants: userId },
                    $inc: { capacity: 1 }
                },
                { new: true, session }
            );
    
            await User.findByIdAndUpdate(
                userId,
                { $pull: { courses: courseId } },
                { session }
            );
            await session.commitTransaction();
            req.flash('success', 'You have successfully unregistered from the course!');
            return res.redirect('/courses/' + courseTitle + '/register');
        } catch(err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }


    } catch (err) {
        err.message = 'Error unregistering from course. Please try again.'; 
        next(err)
    }
}

exports.getCreateCourse = async (req, res, next) => {
    try {
        const trainers = await Trainer.find();
        res.render('create-course', { title: 'Create Course', trainers });
    } catch (err) {
        err.message = 'Error fetching trainers. Please try again.'; 
        next(err)
    }
}

exports.postCreateCourse = async (req, res, next) => {
    try {
        const { title, summary, description, price, capacity, trainerId } = req.body;

        const course = new Course({
            title,
            summary,
            description,
            price: parseFloat(price),
            capacity: parseInt(capacity),
            trainer: trainerId,
            imageUrl: `/assets/img/courses/${req.file.filename}`,
        })
        await course.save();
        
        req.flash('success', 'Course created successfully!');
        res.redirect('/courses')

    } catch(err) {
        err.message = 'Error creating course. Please try again.'; 
        next(err)
    }
}

exports.getEditCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({titleSlug: req.params.titleSlug})
            .populate('trainer')
        const trainers = await Trainer.find();
        res.render('edit-course', { title: 'Edit Course', course, trainers });
    } catch (err) {
        err.message = 'Error fetching course details. Please try again.'; 
        next(err)
    }
}

exports.postEditCourse = async (req, res, next) => {
    try {
        const { title, summary, description, price, capacity, trainerId } = req.body;
        const titleSlug = req.params.titleSlug;

        const course = await Course.findOne({titleSlug: titleSlug});
        if (!course) {
            req.flash('error', 'Course not found. Please try again.');
            return res.redirect('/courses');
        }

        course.title = title;
        course.summary = summary;
        course.description = description;
        course.price = parseFloat(price);
        course.capacity = parseInt(capacity);
        course.trainer = trainerId;

        if (req.file) {
            course.imageUrl = `/assets/img/courses/${req.file.filename}`;
        }

        await course.save();
        
        req.flash('success', 'Course updated successfully!');
        res.redirect('/courses/' + course.titleSlug);

    } catch(err) {
        err.message = 'Error updating course. Please try again.'; 
        next(err)
    }
}   

exports.postDeleteCourse = async (req, res, next) => {
    const { titleSlug } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const course = await Course.findOne({titleSlug: titleSlug});
        if (!course) {
            req.flash('error', 'Course not found. Please try again.');
            return res.redirect('/courses');
        }
        try {
            await User.updateMany(
                { courses: course._id },
                { $pull: { courses: course._id } },
                { session }
            );
            await Course.deleteOne({titleSlug: titleSlug});

            await session.commitTransaction();
            res.redirect('/courses');
            req.flash('success', 'Course deleted successfully!');
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
        
    } catch (err) {
        err.message = 'Error deleting course. Please try again.'; 
        next(err)
    }
}