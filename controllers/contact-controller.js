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
        console.log(err
        );
    }
    res.redirect('/thanks');
}