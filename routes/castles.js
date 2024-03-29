const express = require("express");
const router = express.Router();
// image processing and cloud storage
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
//utils & models
const wrapAsync = require("../utils/wrapAsync");
//middleware & controllers
const { isLoggedIn, verifyAuthor, validateCastle } = require("../middleware");
const castles = require('../controllers/castles');

// Show all castles and create castle routes
router.route('/')
    .get(wrapAsync(castles.index))
    .post(isLoggedIn, upload.array('image'), validateCastle, wrapAsync(castles.createCastle));

router.get("/new", isLoggedIn, castles.renderNewForm);

// Show castle, update and delete castle routes
router.route('/:id')
    .get(wrapAsync(castles.showCastle))
    .put(isLoggedIn, verifyAuthor, upload.array('image'), validateCastle, wrapAsync(castles.updateCastle))
    .delete(isLoggedIn, verifyAuthor, wrapAsync(castles.deleteCastle));

// Edit form route
router.get("/:id/edit", isLoggedIn, verifyAuthor, wrapAsync(castles.renderEditForm));

module.exports = router;