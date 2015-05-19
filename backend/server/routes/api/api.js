var express = require('express'),
    router = express.Router();

var validationRoutes = require('./validations');
var stepRoutes = require('./steps');
var issueRoutes = require('./issues');
var imageRoutes = require('./images');
var userRoutes = require('./users');

router.use('/validations', validationRoutes);
router.use('/steps', stepRoutes);
router.use('/issues', issueRoutes);
router.use('/images', imageRoutes);
router.use('/users', userRoutes);
module.exports = router;

//NOTE: all GET api calls should return an array of results
//      all POST (update) api calls should return a single json object
//      all POST (insert) api calls should return either a single json object or the _id of the new entry
