const Joi = require('@hapi/joi');

const policy = require('./policy');

const schema = Joi.object({
  firstName: Joi.string().pattern(new RegExp('^[a-zA-Z]{2,}$'))
    .required(),
  lastName: Joi.string().pattern(new RegExp('^[a-zA-Z]{2,}$'))
    .required(),
  middleName: Joi.string().pattern(new RegExp('^[a-zA-Z]*$')),
  idNumber: Joi.string().pattern(new RegExp('^[0-9]+$'))
    .required(),
  email: Joi.string().email().required(),
  addressNumber: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]+$'))
    .min(1).required(),
  addressCode: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\s]+$'))
    .min(1).required(),
  addressTown: Joi.string().pattern(new RegExp('^[a-zA-Z\\s]+$'))
    .min(2).required(),
  kraPin: Joi.string().alphanum().min(11),
  phoneNumber: Joi.string().pattern(new RegExp('^0(7\\d{1}|20)\\d{7}$'))
    .required(),
  occupation: Joi.string().min(2).required(),
  insurer: Joi.number().required(),
  policy: policy.schema.required(),
});

module.exports = {
  schema
};
