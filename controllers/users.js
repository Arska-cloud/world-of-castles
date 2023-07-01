const User = require('../models/user');
const { signup, requestPasswordReset, resetPassword } = require("../services/auth");

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.createUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to JustCastles!');
            res.redirect('/castles');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/castles';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/castles');
    });
};

// Controllers for password reset, they need refactoring

module.exports.forgot = (req, res) => {
    res.render('users/forgot');
}

module.exports.reset = (req, res) => {
    const { token } = req.params;
    res.render(`users/reset/${token}`, { token });
}

module.exports.signUp = async (req, res, next) => {
    const signupService = await signup(req.body);
    return res.json(signupService);
};

module.exports.resetRequest = async (req, res, next) => {
    try {
        const link = await requestPasswordReset(req.body.email);
        req.flash('success', 'Reset email successfully sent!');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/forgot');
    }
};

module.exports.resetPasswordController = async (req, res, next) => {
    try {
        await resetPassword(
            req.body.userId,
            req.body.token,
            req.body.password
        );
        req.flash('success', 'Reset email successfully sent!');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/login');
    }
};