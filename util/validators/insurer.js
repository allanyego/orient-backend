const Joi = require('@hapi/joi');

const schema = Joi.object({
  name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]+$'))
    .min(2).required(),
  addressNumber: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]+$'))
    .min(1).required(),
  addressCode: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]+$'))
    .min(1).required(),
  addressTown: Joi.string().pattern(new RegExp('^[a-zA-Z\\s]+$'))
    .min(2).required(),
  kraPin: Joi.string().alphanum().min(11),
  phoneNumber: Joi.string().pattern(new RegExp('^0(7\\d{1}|20)\\d{7}$'))
    .required()
});

module.exports = {
  schema
};
