const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLength: [50, 'Title cannot be longer than 50 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png)$/i.test(v);
            },
            message: 'Image URL must end with jpg or png'
        }
    },
    summary: {
        type: String,
        required: [true, 'Summary is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required']
    },
    registrants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: {
        type: Number,
        default: 0
    },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'Trainer',
    },
    titleSlug: {
        type: String,
        maxLength: [50, 'Title slug cannot be longer than 50 characters'],
        required: [true, 'Title slug is required'],
    }
}, {
    timestamps: true,
    collection: 'courses'
});

courseSchema.pre('validate', function(next) {
    if (this.title) {
        this.titleSlug = slugify(this.title, {
            lower: true,
            trim: true,
            strict: true,
            replacement: '-'
        })
    }
    next();
})

courseSchema.virtual('registrantCount').get(function() {
    return this.registrants.length;
});

courseSchema.methods.isUserRegistered = function(userId) {
    return this.registrants.some(registrant => 
        registrant.toString() === userId.toString()
    );
}

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;