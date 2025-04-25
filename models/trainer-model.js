const mongoose = require('mongoose');
const { Schema } = mongoose;

const trainerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name cannot be longer than 50 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: {
            validator: function(v) {
                return /\.(jpg|png)$/i.test(v);
            },
            message: 'Image URL must end with jpg or png'
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    }
}, {
    timestamps: true,
    collection: 'trainers',
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

trainerSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'trainer',
    count: true,
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;