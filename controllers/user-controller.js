const User = require('../models/user-model');


exports.getLogin = async (req, res, next) => {
    const authMessage = req.query.authMessage;
    if (authMessage === 'true') {
        return res.render('login', { title: 'Login', message: 'Account created successfully. Please login.' });
    }
    res.render('login', { title: 'Login'});
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        const isValidPassword = await user.validatePassword(password);

        if(!isValidPassword) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/auth/login');
        }

        // Set session variables
        req.session.isLoggedIn = true;
        req.session.user = user;

        await new Promise((resolve, reject) => {
            req.session.save(err => {
                if (err) reject(err);
                resolve();
            });
        });
        req.flash('success', 'Login successful! Welcome back ' + user.firstName + '!');
        return res.redirect('/');
        

    } catch (err) {
        console.error('Login error:', err);
        return res.render('login', {title: 'Login', message: 'An error occurred during login', email });
    }
};
exports.getSignUp = async (req, res, next) => {
    res.render('signup', { title: 'Sign Up', message: '' });
}

exports.postSignUp = async (req, res, next) => {
    const { email, firstName, lastName,  password, confirm_password } = req.body;

    try {
        
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error', 'Email already exists');
            return res.render('signup', { title: 'Sign Up', message: '', email, firstName, lastName, password, confirm_password });
        }
        if (password !== confirm_password) {
            req.flash('error', 'Passwords do not match');
            return res.render('signup', { title: 'Sign Up', message: '', email, firstName, lastName, password, confirm_password });
        }

        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        req.flash('success', 'Account created successfully! Please login.');
        return res.redirect('/auth/login');
    } catch (err) {
        console.log(err)
        req.flash('error', 'An error occurred during signup. Please try again.');
        return res.render('signup', { title: 'Sign Up', message: '', email, firstName, lastName, password, confirm_password });
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.flash('success', 'Logout successful!');

        delete req.session.user;
        req.session.isLoggedIn = false;

        await new Promise((resolve, reject) => {
            req.session.save(err => {
                if (err) reject(err);
                resolve();
            });
        });
        res.redirect('/');
    } catch(err) {
        console.error('Logout error:', err);
        req.flash('error', 'An error occurred during logout. Please try again.');
        res.redirect('/');
    }
}