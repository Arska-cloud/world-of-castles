const express = require("express");
const router = express.Router({ mergeParams: true });
// utils & middleware
const { validateReview, isLoggedIn, verifyReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
// controllers
const reviews = require('../controllers/reviews');

// Create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, verifyReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;