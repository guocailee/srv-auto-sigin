'use strict'
var router = require('express').Router()
router.use('/todos', require('./todos.js'))
router.use('/signin', require('./signin.js'))
router.use('/project', require('./project.js'))
module.exports = router
