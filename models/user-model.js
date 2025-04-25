const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        maxLength: [50, 'First name cannot be longer than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        maxLength: [50, 'Last name cannot be longer than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        maxLength: [50, 'Email cannot be longer than 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        maxLength: [100, 'Password cannot be longer than 100 characters']
    },
    roles: {
        type: [String],
        enum: ['user', 'admin'],
        default: ['user']
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.hasRole = function(role) {
    return this.roles.includes(role);
};

const User = mongoose.model('User', userSchema);

module.exports = User;