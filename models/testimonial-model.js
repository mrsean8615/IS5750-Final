const mongoose = require('mongoose');
const { Schema } = mongoose;

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name cannot be longer than 50 characters']
    },
    profession: {
        type: String,
        required: [true, 'Profession is required'],
        maxLength: [50, 'Profession cannot be longer than 50 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        maxLength: [255, 'Image URL cannot be longer than 255 characters']
    }
}, {
    timestamps: true,
    collection: 'testimonials'
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;