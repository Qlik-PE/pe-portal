var express = require('express'),
    router = express.Router();

var validationRoutes = require('./validation');
var stepRoutes = require('./validation-steps');

router.use('/validations', validationRoutes);
router.use('/steps', stepRoutes);
module.exports = router;
