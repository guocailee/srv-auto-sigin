'use strict';
var router = require('express').Router();
router.use('/todos', require('./todos.js'))
router.use('/signin', require('./signin.js'))
module.exports = router;