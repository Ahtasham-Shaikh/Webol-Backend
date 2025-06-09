const express = require('express')
const router = express.Router()
const { getTvShows } = require('../controllers/tvShowsController')

router.get('/', getTvShows)

module.exports = router
