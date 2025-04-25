const mongoose = require("mongoose");

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

const MONGODB_URI = "mongodb+srv://merlin:superpassword@cluster0.v3bio.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("SUCCESS!");

    await Promise.all([
      await mongoose.model('Trainer').deleteMany({}),
      await mongoose.model('Course').deleteMany({}),
      await mongoose.model('Event').deleteMany({}),
      await mongoose.model('Testimonial').deleteMany({})
    ])
    const trainers = await Trainer.insertMany(trainerData)
    
    const mappedCourseData = courseData.map((course, index) => ({
      ...course,
      trainer: trainers[index]._id
    }));
    
    await Promise.all([
      Course.insertMany(mappedCourseData),
      Event.insertMany(eventData),
      Testimonial.insertMany(testimonialData)
    ]);

    console.log("Data seeded successfully!");
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
