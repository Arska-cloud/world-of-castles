const Joi = require('joi');

module.exports.castleSchema = Joi.object({
    castle: Joi.object({
        /* image: Joi.string().required(), */
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});