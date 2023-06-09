const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CastleSchema = new Schema({
    title: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Castle', CastleSchema);
