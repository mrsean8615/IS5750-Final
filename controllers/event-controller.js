const Event = require("../models/event-model");
const formatDate = require("../util/date-convert");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      order: [["date", "ASC"]],
    });
    res.render("events", { title: "Events", events, formatDate });
  } catch (err) {
    console.log(err);
  }
};
