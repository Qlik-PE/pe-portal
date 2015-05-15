var express = require('express'),
    router = express.Router();

var validationRoutes = require('./validation');

router.use('/validations', validationRoutes);
module.exports = router;
