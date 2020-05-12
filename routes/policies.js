const express = require('express');

const auth = require('../middleware/auth');
const { createSchema, editSchema } = require('../util/validators/policy');
const createResponse = require('./helpers/createResponse');
const controller = require('../controllers/policies');
const insurerCtrl = require('../controllers/insurers');
const clientCtrl = require('../controllers/clients');
const vehicleCtrl = require('../controllers/vehicles');

const router = express.Router();

// GET policies; optionally by client, insurer
router.get('/', async (req, res, next) => {
  try {
    let data;
    const { client, insurer, search, limit, type } = req.query;
    if (client || insurer) {
      data = await controller.find({
        client, insurer, limit, type
      });
    } else if (search) {
      data = await controller.find({ search, limit, type });
    } else {
      data = await controller.find({ limit, type });
    }

    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

// GET a policy by id
router.get('/:policyId', async (req, res, next) => {
  try {
    const data = await controller.findById(req.params.policyId);
    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

// GET a policy vehicle
router.get('/:policyId/vehicle', async (req, res, next) => {
  try {
    const data = await vehicleCtrl.findByPolicy({
      policy: req.params.policyId
    });
    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

// PUT new policy details
router.put('/:policyId', auth, async (req, res, next) => {
  try {
    await editSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    const updatedPolicy = await controller.edit({
      id: req.params.policyId,
      approved: true
    });
    return res.json(createResponse({ data: updatedPolicy }));
  } catch (error) {
    next(error);
  }

});

// POST a new policy
router.post('/', auth, async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    const isClient = await clientCtrl.findById(req.body.client);
    if (!isClient) {
      return res.json(createResponse({
        error: 'No client by that identifier found.'
      }));
    }
    const isInsurer = await insurerCtrl.findById(req.body.insurer);
    if (!isInsurer) {
      return res.json(createResponse({
        error: 'No insurer by that identifier found.'
      }));
    }
    const isPolicy = await controller.findOne(req.body.policyNumber);
    if (isPolicy) {
      return res.json(createResponse({
        error: 'A policy by that number already exists.'
      }));
    }

    if (req.body.vehicle) {
      const isVehicle = await vehicleCtrl.findOne(req.body.vehicle);
      if (isVehicle) {
        return res.json(createResponse({
          error: 'There seems to a vehicle already registered with those details.'
        }))
      }
    }

    const newPolicy = await controller.create(req.body);
    return res.status(201).json(createResponse({
      data: newPolicy
    }));
  } catch (error) {
    next(error);
  }

});

module.exports = router;