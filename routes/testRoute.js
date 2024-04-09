const express = require('express')
const { testFunction } = require('../controllers/testCOntroller')
const router = express.Router()

router.get('/test',testFunction)

module.exports = router