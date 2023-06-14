const express = require("express");
const router = express.Router({ mergeParams: true });
// utils & middleware
const { validateReview, isLoggedIn, verifyReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
// models
const Review = require("../models/review");
const Castle = require("../models/castle");

// Create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  castle.reviews.push(review);
  await review.save();
  await castle.save();
  req.flash('success', 'Successfully added your comment!');
  res.redirect(`/castles/${castle._id}`);
})
);

// Delete review route
router.delete("/:reviewId", isLoggedIn, verifyReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Castle.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted your comment');
  res.redirect(`/castles/${id}`);
})
);

module.exports = router;
