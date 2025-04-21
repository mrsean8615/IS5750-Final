const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course-controller');

router.get('/', courseController.getCourses);

router.get('/:titleSlug', courseController.getCourse);

module.exports = router;