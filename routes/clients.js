const express = require('express');

const auth = require('../middleware/auth');
const createResponse = require('./helpers/createResponse');
const { schema } = require('../util/validators/client');

const controller = require('../controllers/clients');
const policyCtrl = require('../controllers/policies');
const insurerCtrl = require('../controllers/insurers');
const vehicleCtrl = require('../controllers/vehicles');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, limit } = req.query;
    let data;
    if (search) {
      data = await controller.find({ search, limit });
    } else {
      data = await controller.find({ limit });
    }
    
    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

router.get('/:clientId', async (req, res, next) => {
  try {
    const data = await controller.findById(req.params.clientId);
    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    const isInsurer = await insurerCtrl.findById(req.body.insurer);
    if (!isInsurer) {
      return res.json(createResponse({
        error: 'No insurer found by that identifier.'
      }));
    }
    
    const isPolicy = await policyCtrl.findOne(req.body.policy.policyNumber);
    if (isPolicy) {
      return res.json(createResponse({
        error: 'A policy by that number already exists.'
      }));
    }

    if (req.body.policy.vehicle) {
      const isVehicle = await vehicleCtrl.findOne(req.body.policy.vehicle);
      if (isVehicle) {
        return res.json(createResponse({
          error: 'There seems to a vehicle already registered with those details.'
        }))
      }
    }

    const isClient = await controller.findOne(req.body);
    if (isClient) {
      return res.json(createResponse({
        error: 'We already have a client with that national ID and KRA pin.'
      }));
    }

    const data = await controller.create(req.body);
    res.status(201).json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;