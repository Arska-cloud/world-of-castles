const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Castle = require("../models/castle");
const { reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const router = express.Router({ mergeParams: true });
const Joi = require("joi");

// Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Create & delete routes for reviews
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id);
  const review = new Review(req.body.review);
  castle.reviews.push(review);
  await review.save();
  await castle.save();
  req.flash('success', 'Successfully added your comment.');
  res.redirect(`/castles/${castle._id}`);
})
);

router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Castle.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted your comment.');
  res.redirect(`/castles/${id}`);
})
);

module.exports = router;
