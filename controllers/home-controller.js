const Trainer = require("../models/trainer-model");
const Course = require("../models/course-model");
const Event = require("../models/event-model");
const Testimonial = require("../models/testimonial-model");

const {getTop3Courses} = require('./course-controller');

const getCounts = async () => {
  try {
    const trainersCount = await Trainer.countDocuments();
    const coursesCount = await Course.countDocuments();
    const eventsCount = await Event.countDocuments();
    return { trainersCount, coursesCount, eventsCount };

  } catch (err) {
    console.log(err);
  } 
}

const getTop3Trainers = async () => {
  try {
    const trainers = await Trainer.find()
      .limit(3)
    return trainers;
  } catch (err) {
    console.log(err);
  }
}

exports.getHome = async (req, res) => {
  try {
    const counts = await getCounts();
    const trainers = await getTop3Trainers();
    const top3Courses = await getTop3Courses();
    res.render("index", { title: "Home", imageName: "about.jpg", counts, top3Courses, trainers});
  } catch (err) {
    err.message = 'Error fetching home page data. Please try again.'; 
    next(err)
  }
};

exports.getAbout = async (req, res) => {
  try {
    const testimonials = await getTestimonials();
    const counts = await getCounts();
    res.render("about", { title: "About", imageName: "about-2.jpg", counts, testimonials });
  } catch (err) {
    err.message = 'Error fetching about page data. Please try again.'; 
    next(err)
  }
};

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.render("trainers", { title: "Trainers", trainers });
  } catch (err) {
    err.message = 'Error fetching trainers. Please try again.'; 
    next(err)
  }
};

exports.getThanks = (req, res) => {
  res.render("thanks", { title: "Thanks" });
}

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    return testimonials;
  } catch (err) {
    err.message = 'Error fetching testimonials. Please try again.'; 
    next(err)
  }
}