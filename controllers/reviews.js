const Castle = require('../models/castle');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const castle = await Castle.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    castle.reviews.push(review);
    await review.save();
    await castle.save();
    req.flash('success', 'Successfully added your comment!');
    res.redirect(`/castles/${castle._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Castle.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your comment');
    res.redirect(`/castles/${id}`);
};