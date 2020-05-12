'use strict'
var router = require('express').Router()
router.use('/signin', require('./signin.js'))
module.exports = router
