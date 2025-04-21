const Trainer = require("../models/trainer-model");
const Course = require("../models/course-model");
const Event = require("../models/event-model");
const Testimonial = require("../models/testimonial-model");

const {getTop3Courses} = require('./course-controller');

const getCounts = async () => {
  try {
    const trainersCount = await Trainer.count();
    const coursesCount = await Course.count();
    const eventsCount = await Event.count();
    return { trainersCount, coursesCount, eventsCount };

  } catch (err) {
    console.log(err);
  } 
}

const getTop3Trainers = async () => {
  try {
    const trainers = await Trainer.findAll({
      limit: 3
    });
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
    console.log(err);
  }
};

exports.getAbout = async (req, res) => {
  try {
    const testimonials = await getTestimonials();
    const counts = await getCounts();
    res.render("about", { title: "About", imageName: "about-2.jpg", counts, testimonials });
  } catch (err) {
    console.log(err);
  }
};

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    res.render("trainers", { title: "Trainers", trainers });
  } catch (err) {
    console.log(err);
  }
};

exports.getThanks = (req, res) => {
  res.render("thanks", { title: "Thanks" });
}

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    return testimonials;
  } catch (err) {
    console.log(err);
  }
}