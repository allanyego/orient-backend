var express = require('express');
var router = express.Router();

const insurersRouter = require('./insurers');
const clientsRouter = require('./clients');
const policiesRouter = require('./policies');
const adminsRouter = require('./admins');

/* GET home page. */
router.use('/insurers', insurersRouter);
router.use('/clients', clientsRouter);
router.use('/policies', policiesRouter);
router.use('/admins', adminsRouter);

module.exports = router;
