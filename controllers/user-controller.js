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
        const user = await User.findOne({
            where: {email: email}
        });

        if (!user) {
            return res.render('login', { title: 'Login', message: 'Invalid email or password', email });
        }

        const isValidPassword = await user.validatePassword(password);
        console.log('Password valid:', isValidPassword);

        if(!isValidPassword) {
            return res.render('login', { title: 'Login', message: 'Invalid email or password', email });
        }

        // Set session variables
        req.session.isLoggedIn = true;
        req.session.username = user.username;
        req.session.userId = user.id;

        await new Promise((resolve, reject) => {
            req.session.save(err => {
                if (err) reject(err);
                resolve();
            });
        });

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
    const { email, name, password, confirm_password } = req.body;

    try {

        if (password !== confirm_password) {
            return res.render('signup', { title: 'Sign Up', message: 'Passwords do not match', email, name, password, confirm_password });
        }
        await User.create({
            username: name,
            email: email,
            password: password
        });

        return res.redirect('/auth/login?authMessage=true');
    } catch (err) {
        return res.render('signup', { title: 'Sign Up', message: '', email, name, password, confirm_password });
    }
}

exports.logout = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
}