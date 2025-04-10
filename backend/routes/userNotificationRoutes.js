const express = require('express')
const userNotificationController = require('../controllers/userNotificationController')
const router = express.Router();


//GET ALL NOTIFICATIONS FOR A USER
router.get('/:username',userNotificationController.notifications_get)
  
//NOTIFICATION DELETED
router.delete('/:username/:path',userNotificationController.notifications_delete)
  
module.exports = router;