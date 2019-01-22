'use strict'
var router = require('express').Router()
var AV = require('leanengine')

var Project = AV.Object.extend('Project')

// 新增project
router.post('/', function(req, res, next) {
  var projectBody = req.body.project
  var project = new Project()
  for (let key in projectBody) {
    project.set(key, projectBody[key])
  }
  project
    .save()
    .then(function(project) {
      res.json({
        code: '0000',
        success: true
      })
    })
    .catch(next)
})

module.exports = router
