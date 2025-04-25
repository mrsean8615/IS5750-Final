exports.get404 = (req, res, next) => {
    res.status(404).render('404', { 
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
};

exports.get500 = (err, req, res, next) => {
    res.status(err.statusCode || 500).render('500', {
        title: 'Internal Server Error',
        message: err.message || 'Something went wrong. Please try again later.'
    });
};