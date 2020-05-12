var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const controller = require('../controllers/insurers');
const { schema } = require('../util/validators/insurer');
const createResponse = require('./helpers/createResponse');

/* GET insurer listing. */
router.get('/', async function (req, res, next) {
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

// Find insurer by id
router.get('/:insurerId', async function (req, res, next) {
  try {
    const data = await controller.findById(req.params.insurerId)
    res.json(createResponse({ data }));
  } catch (error) {
    next(error);
  }
});

// create  a new insurer
router.post('/', auth, async function (req, res, next) {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    // Check possible duplicates
    const isRegistered = await controller.findOne(req.body);
    if (isRegistered) {
      return res.json({
        status: 'error',
        error: 'Looks like we already have you registered.'
      });
    }

    const newInsurer = await controller.create(req.body);
    res.status(201).json(createResponse({ data: newInsurer }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
