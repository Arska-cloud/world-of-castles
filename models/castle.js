const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CastleSchema = new Schema({
    image: String,
    title: String,
    location: String,
    description: String
})

module.exports = mongoose.model('Castle', CastleSchema);
