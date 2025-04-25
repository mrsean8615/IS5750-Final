const jwt = require('jsonwebtoken');
const Course = require('../models/course-model');
const axios = require('axios');

exports.getToken = async (req, res, next) => {
    try {
        const token = jwt.sign(
            {
                type: 'api_access',
                timestamp: Date.now(),
            },
            'secret',
            {expiresIn: '24h'}
            
        );
        res.status(200).json({ 
            status: 'success',
            token: token,
            expiresIn: '24h',
         });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error',
         });
    }
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(401).json({ 
                status: 'error',
                message: 'No token provided',
             });
        }
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'Failed to authenticate token',
                 });
            }
        
            req.userId = decoded.id;
            next();
        });
    
        } catch(err) {
            console.log(err);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
             });
        }
    }

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('trainer')
            .select('-registrants')
            .lean()

            const editedCourses = courses.map(course => {
                return {
                    ...course,
                    imageUrl: `${req.protocol}://${req.get('host')}/${course.imageUrl}`,
                    trainer: {
                        name: course.trainer.name,
                        imageUrl: `${req.protocol}://${req.get('host')}/${course.trainer.imageUrl}`,
                    }
                }
            });
        res.status(200).json({ 
            status: 'success',
            count: editedCourses.length,
            courses: editedCourses,
         });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error',
         });
    }

}


exports.getExternalApiData = async (req, res, next) => {
    try {
        const response = await axios.get('https://isro.vercel.app/api/customer_satellites');

        res.render('external-api', {
            title: 'Satellite Data',
            data: response.data
        });
    } catch (err) {
        err.statusCode = 500
        err.message = 'Failed to fetch data from external API'; 
        next(err)
    }
}