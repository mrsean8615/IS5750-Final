const Event = require("../models/event-model");
const formatDate = require("../util/date-convert");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })

    res.render("events", { title: "Events", events, formatDate });
  } catch (err) {
    err.message = 'Error fetching events. Please try again.'; 
    next(err)
  }
};
