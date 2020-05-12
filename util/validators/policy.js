const Joi = require('@hapi/joi');

const vehicle = require('./vehicle');

const common = {
  policyNumber: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\\/]{2,}$'))
    .required(),
  policyPeriod: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().min(Joi.ref('start')).required(),
  }),
  sumInsured: Joi.number().min(0).required(),
  premiumRate: Joi.number().min(0).required().required(),
  pvt: Joi.number().min(0).required().required(),
  excessProtection: Joi.boolean(),
  antiTheftCoverage: Joi.boolean(),
  rookie: Joi.boolean(),
  passengersPllCoverage: Joi.boolean(),
  policyClass: Joi.string().required(),
  vehicle: vehicle.schema,
}
const schema = Joi.object({
  ...common
});

const createSchema = Joi.object({
  client: Joi.number().required(),
  insurer: Joi.number().required(),
  ...common,
});

const editSchema = Joi.object({
  approved: Joi.boolean().required(),
});

module.exports = {
  schema,
  createSchema,
  editSchema,
};
