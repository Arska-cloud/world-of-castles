const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CastleSchema = new Schema({
    image: String,
    title: String,
    location: String,
    description: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

CastleSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    };
});

module.exports = mongoose.model('Castle', CastleSchema);
