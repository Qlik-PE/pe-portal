var express = require('express'),
    router = express.Router();

var validationRoutes = require('./validation');
var stepRoutes = require('./validation-steps');
var issueRoutes = require('./issue');
var imageRoutes = require('./images');

router.use('/validations', validationRoutes);
router.use('/steps', stepRoutes);
router.use('/issues', issueRoutes);
router.use('/images', imageRoutes);
module.exports = router;
