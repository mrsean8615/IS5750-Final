const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');



const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'logRequests.txt'),
  { flags: 'a' }
);

const requestLogger = morgan('dev', {
    stream: accessLogStream
})

const isAuth = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    req.flash('error', 'You need to be logged in to access this page.');
    return res.redirect('/auth/login');
  }
  next();
}

const isAdmin =  (req, res, next) => {
    const user = req.session.user;
    if (!user || !user.roles || !user.roles.includes('admin')) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/'); 
    }
    next();
}

const ensureDirectoryExists = (dirPath) => {
  if(!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }
}

const uploadConfigs = {
    courses: {
        path: path.join(__dirname, 'public', 'assets', 'img', 'courses'),
        allowedTypes: /jpeg|jpg|png/
    },
    trainers: {
        path: path.join(__dirname, 'public', 'assets', 'img', 'trainers'),
        allowedTypes: /jpeg|jpg|png/
    },
}


Object.values(uploadConfigs).forEach(config => {
    ensureDirectoryExists(config.path);
});


const createStorage = (uploadType) => {
    if (!uploadConfigs[uploadType]) {
        throw new Error(`Invalid upload type: ${uploadType}`);
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadConfigs[uploadType].path);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
};

const createFileFilter = (uploadType) => {
    return (req, file, cb) => {
        const config = uploadConfigs[uploadType];
        const mimetype = config.allowedTypes.test(file.mimetype);
        const extname = config.allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error(`Only ${config.allowedTypes.source} formats allowed!`));
    };
};


const upload = {
    courses: multer({
        storage: createStorage('courses'),
        fileFilter: createFileFilter('courses')
    }),
    trainers: multer({
        storage: createStorage('trainers'),
        fileFilter: createFileFilter('trainers')
    })
};


module.exports = {requestLogger, isAuth, isAdmin, upload};