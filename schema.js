const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string().allow("", null),
  }),
  price: Joi.number().min(0).max(99999).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
}).required();

const reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
});

module.exports = { listingSchema, reviewSchema };
