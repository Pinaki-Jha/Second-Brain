const express = require('express')
const userAuthController = require('../controllers/userAuthController')

const router = express.Router();


router.post('/check-username', userAuthController.check_username_post)
  
router.post('/register', userAuthController.register_post)
  
  
router.post('/login',userAuthController.login_post )
 
  
module.exports = router;