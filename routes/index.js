'use strict';
var router = require('express').Router();
router.use('/todos', require('./todos.js'))

module.exports = router;