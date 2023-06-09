const express = require('express');
const path = require('path');
const app = express();

// Server port and host
app.listen(3000, () => {console.log('Serving on port 3000')});

// Connecting views engine and folder
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// Routes
app.get('/', (req, res) => {
    res.render('home')
});