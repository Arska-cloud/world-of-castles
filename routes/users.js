const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

// Show register form and post user routes
router.route('/register')
    .get(users.renderRegister)
    .post(wrapAsync(users.createUser));

// Show login form and log in routes
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// Logout route
router.get('/logout', users.logout);

module.exports = router;