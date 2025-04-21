const Course = require('../models/course-model');
const Trainer = require('../models/trainer-model');


exports.configModelRelations = () => {

    const trainerForKey = {
        foreignKey: 'trainerId',
    }
    Trainer.hasMany(Course, trainerForKey);
    Course.belongsTo(Trainer, trainerForKey);
};