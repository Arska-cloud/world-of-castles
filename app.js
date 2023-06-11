const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const Castle = require('./models/castle');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {castleSchema} = require('./schemas.js')

const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

// Server port, host & database connection
app.listen(3000, () => {console.log('Serving on port 3000')});
mongoose.connect('mongodb://127.0.0.1:27017/world-of-castles', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {console.log('Database connected')});

// Connecting views engine and folder
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// This function will leave soon

const validateCastle = (req, res, next) => {
    const {error} = castleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/castles', wrapAsync(async (req, res) => {
    const castles = await Castle.find({});
    res.render('castles/index', {castles});
}));

app.get('/castles/new', (req, res) => {
    res.render('castles/new');
});

// Create, Edit, Update and delete routes
app.post('/castles', validateCastle, wrapAsync(async (req, res) => {
    const castle = new Castle(req.body.castle);
    await castle.save();
    res.redirect(`/castles/${castle._id}`);
}));

app.get('/castles/:id/edit', wrapAsync(async (req, res) => {
    const castle = await Castle.findById(req.params.id);
    res.render('castles/edit', {castle});
}));

app.put('/castles/:id', validateCastle, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const castle = await Castle.findByIdAndUpdate(id,{...req.body.castle});
    res.redirect(`/castles/${castle._id}`);
}));

app.delete('/castles/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Castle.findByIdAndDelete(id);
    res.redirect('/castles');
}));
// Show route
app.get('/castles/:id', wrapAsync(async (req, res) => {
    const castle = await Castle.findById(req.params.id);
    res.render('castles/show', {castle});
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err
    if (!err.message) err.message = 'It looks like you got lost on your way to Santiago!'
    res.status(statusCode).render('error', {err});
});

