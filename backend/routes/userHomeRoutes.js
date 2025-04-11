const express = require('express')
const userHomeController = require('../controllers/userHomeController')

const router = express.Router();



router.get('/homeinfo/:username', userHomeController.homeinfo_get)
  

module.exports = router;
