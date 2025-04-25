const Contact = require('../models/contact-model');

exports.getContacts = async (req, res, next) => {
    res.render('contact', { title: 'Contacts' });
}   

exports.postContact = async (req, res, next) => {
    const request = req.body;
    try {
        await Contact.create({
            name: request.name,
            email: request.email,
            subject: request.subject,
            message: request.message,
            post_date: new Date()
        });
    } catch (err) {
        err.message = 'Error creating contact message!'; 
        next(err)
    }
    res.redirect('/thanks');
}

exports.renderContactResponse = async (req, res, next) => {
    res.render('contact-response', { title: 'Contact Response' });
}

exports.getContactResponse = async (req, res, next) => {
    try {
        const contacts = await Contact.find()
            .where({ response: null }) 
            .sort({ post_date: -1 })

        res.locals.contacts = contacts;
        next();
    } catch (err) {
        err.message = 'Error fetching contact messages!'; 
        next(err)
    }
}

exports.loadContact = async (req, res, next) => {
    const {contactId} = req.body;
    try {
        const contact = await Contact.findById(contactId);
        if (contact) {
            res.locals.contact = contact;
        } else {
            res.locals.contact = null;
        }
        next();
    } catch (err) {
        err.message = 'Error loading contact message!'; 
        next(err)
    }
}

exports.postContactResponse = async (req, res, next) => {
    const { contactId, response } = req.body;
    try {
        await Contact.findByIdAndUpdate(contactId, { 
            response: response,
            response_date: new Date()
        });
        req.flash('success', 'Response sent successfully!');
        res.redirect('/contacts/admin/contact-response');
    } catch (err) {
        err.message = 'Error sending response!'; 
        next(err)
    }
}