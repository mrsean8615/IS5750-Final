const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name cannot be longer than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxLength: [50, 'Email cannot be longer than 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    post_date: {
        type: Date,
        required: [true, 'Post date is required']
    },
    response: {
        type: String,
        default: null
    },
    response_date: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'contacts'
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;