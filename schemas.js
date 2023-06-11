const Joi = require('joi');

module.exports.castleSchema = Joi.object({
    castle: Joi.object({
        image: Joi.string().required(),
        title: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});