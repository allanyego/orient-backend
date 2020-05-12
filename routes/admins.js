var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const controller = require('../controllers/admins');
const { schema, loginSchema, passwordSchema } =
  require('../util/validators/admins');
const createResponse = require('./helpers/createResponse');

// create  a new admin
router.post('/register', auth, async function (req, res, next) {
  try {
    await schema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    // Check possible duplicates
    const isRegistered = await controller.findOne(req.body);
    if (isRegistered) {
      return res.json(createResponse({
        error: 'Looks like we already have you registered.'
      }));
    }

    const newAdmin = await controller.create(req.body);
    res.status(201).json(createResponse({
      data: newAdmin
    }));
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    const isAdmin = await controller.findOne(req.body);
    if (!isAdmin) {
      return res.json(createResponse({
        error: 'No admin by that email found.'
      }));
    }

    const authenticated = await controller.authenticate(req.body);
    if (!authenticated) {
      return res.status(401).json(createResponse({
        error: 'Invalid credentials provided.'
      }));
    }

    if (authenticated.accState && authenticated.accState === 'NEEDS_RESET') {
      return res.json(createResponse({
        error: authenticated
      }));
    }


    return res.json(createResponse({
      data: authenticated
    }));
  } catch (error) {
    next(error);
  }
});

router.put('/:adminId/change-password', async (req, res, next) => {
  try {
    await passwordSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json(createResponse({ error }));
  }

  try {
    const isAdmin = await controller.findById(req.params.adminId);
    if (!isAdmin) {
      return res.json(createResponse({
        error: 'No admin found by that identifier'
      }));
    }

    const isPasswordMatch = await controller.isAdminPassword({
      adminId: req.params.adminId,
      password: req.body.oldPassword,
    });
    if (!isPasswordMatch) {
      return res.status(401).json(createResponse({
        error: 'Value for old password does not match'
      }));
    }

    const updatedAdmin = await controller.editPassword({
      adminId: req.params.adminId,
      newPassword: req.body.newPassword
    });

    return res.json(createResponse({
      data: updatedAdmin
    }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
