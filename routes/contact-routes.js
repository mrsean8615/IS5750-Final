const express = require('express');
const router = express.Router();

const {isAuth, isAdmin} = require('../middleware')

const contactController = require('../controllers/contact-controller');

router.get('/new', contactController.getContacts);

router.post('/create', contactController.postContact);

router.use(isAuth)
router.use(isAdmin)
router.get('/admin/contact-response', contactController.getContactResponse, contactController.renderContactResponse)
router.post('/admin/load', contactController.loadContact, contactController.getContactResponse, contactController.renderContactResponse) 
router.post('/admin/respond', contactController.postContactResponse, contactController.getContactResponse, contactController.renderContactResponse)
module.exports = router;