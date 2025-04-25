const Trainer = require('../models/trainer-model');

exports.getCreateTrainer = async (req, res, next) => {
    try {
        res.render('create-trainer', { title: 'Create Trainer' });
    } catch (err) {
        err.message = 'Error fetching create trainer page. Please try again.'; 
        next(err)
    }
}

exports.postCreateTrainer = async (req, res, next) => {
    try {
        const { name, subject, description } = req.body;
        const trainer = new Trainer({
            name,
            subject,
            description,
            imageUrl: `/assets/img/trainers/${req.file.filename}`,
        })
        await trainer.save();
        
        req.flash('success', 'Trainer created successfully!');
        res.redirect('/trainers/admin/manage')
    } catch(err) {
        console.error(err)
        err.message = 'Error creating trainer. Please try again.'; 
        next(err)
    }
}

exports.getManageTrainers = async (req, res, next) => {
    try {
        const trainers = await Trainer.find()
            .sort({ name: 1 })
            .populate('courses')
            .lean()

        res.render('manage-trainers', { title: 'Manage Trainers', trainers });
    } catch (err) {
        err.message = 'Error fetching trainers. Please try again.'; 
        next(err)
    }
}

exports.postDeleteTrainer = async (req, res, next) => {
    try {
        const {trainerId} = req.body;
        await Trainer.findByIdAndDelete(trainerId);
        req.flash('success', 'Trainer deleted successfully!');
        res.redirect('/trainers/admin/manage')
    } catch (err) {
        err.message = 'Error deleting trainer. Please try again.'; 
        next(err)
    }
}