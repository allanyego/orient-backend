const Joi = require('@hapi/joi');

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
  phoneNumber: Joi.string().pattern(new RegExp('^0(7\\d{1}|20)\\d{7}$'))
    .required(),
});

const passwordSchema = Joi.object({
  oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,45}$'))
    .required(),
  newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,45}$'))
    .required(),
  newPasswordConfirm: Joi.equal(Joi.ref('newPassword'))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,45}$'))
    .required(),
});

module.exports = {
  schema,
  passwordSchema,
  loginSchema
};
