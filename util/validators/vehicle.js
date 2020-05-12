const Joi = require('@hapi/joi');

const schema = Joi.object({
  registrationNumber: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]{2,}$'))
    .required(),
  make: Joi.string().min(2).required(),
  bodyType: Joi.string().pattern(new RegExp('^[a-zA-Z\\s]{2,}$'))
    .required(),
  bodyColor: Joi.string().pattern(new RegExp('^[a-zA-Z]{2,}$')).required(),
  manufactureYear: Joi.date().required(),
  chasisNumber: Joi.string().required(),
  engineNumber: Joi.string().required(),
  ratingCc: Joi.string().pattern(new RegExp('^[0-9]{1,}$'))
    .required(),
  tonnage: Joi.string().pattern(new RegExp('^[a-zA-Z\\s]{2,}$'))
    .required(),
});

module.exports = {
  schema
};
