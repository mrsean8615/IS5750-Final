const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contact-controller');

router.get('/new', contactController.getContacts);

router.post('/create', contactController.postContact);

module.exports = router;