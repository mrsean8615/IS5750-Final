const sequelize = require("./database");

const modelConfig = require("./model-config");

const Trainer = require("../models/trainer-model");
const trainerData = require("../data/trainers.json");

const Course = require("../models/course-model");
const courseData = require("../data/courses.json");

const Event = require("../models/event-model");
const eventData = require("../data/events.json");

const Contact = require("../models/contact-model");
const User = require("../models/user-model");

const Testimonial = require("../models/testimonial-model");
const testimonialData = require("../data/testimonials.json");

modelConfig.configModelRelations();

sequelize
  .sync({ force: true })
  .then((result) => {
    console.log("SUCCESS!", result);
  })
  .then(() => {
    return Trainer.bulkCreate(trainerData);
  })
  .then(() => {
    return Event.bulkCreate(eventData);
  })
  .then(() => {
    return Course.bulkCreate(courseData);
  })
  .then(() => {
    return Testimonial.bulkCreate(testimonialData);
  })
  .catch((err) => {
    console.log(err);
  });
