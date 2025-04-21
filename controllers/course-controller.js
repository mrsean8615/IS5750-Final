const Course = require('../models/course-model');
const Trainer = require('../models/trainer-model');

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            include: Trainer
        });
        res.render('courses', { title: 'Courses', courses });
    } catch (err) {
        console.log(err);
    }
}

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            where: {
                titleSlug: req.params.titleSlug
            },
            include: Trainer
        });
        res.render('course-details', { title: course.title, course });
    } catch (err) {
        console.log(err);
    }
}

exports.getTop3Courses = async (req, res, next) => {
    try {
        const courses = await Course.findAll({
            order: [['likes', 'DESC']],
            limit: 3,
            include: Trainer
        });
        return courses
    } catch (err) {
        console.log(err);
    }
}