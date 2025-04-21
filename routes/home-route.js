const express = require("express");
const router = express.Router();

// controllers
const homeController = require("../controllers/home-controller");

router.get("/", homeController.getHome);

router.get("/about", homeController.getAbout);

router.get("/thanks", homeController.getThanks);

module.exports = router;
