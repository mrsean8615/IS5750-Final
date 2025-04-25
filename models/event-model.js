const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLength: [50, 'Title cannot be longer than 50 characters']
    },
    summary: {
        type: String,
        required: [true, 'Summary is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        maxLength: [350, 'Image URL cannot be longer than 350 characters'],
        validate: {
            validator: function(v) {
                return /\.(jpg|png)$/i.test(v);
            },
            message: 'Image URL must end with jpg or png'
        }
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    }
}, {
    timestamps: true,
    collection: 'events'
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;