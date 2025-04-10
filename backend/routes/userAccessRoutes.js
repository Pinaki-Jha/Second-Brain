const express = require('express')
const userAccessController = require('../controllers/userAccessController')

const router = express.Router();



//REQUESTING ACCESS FROM OWNER
router.post('/reqacc/:username/:path', userAccessController.reqacc_post )
  
//ACCESS GRANTED BY OWNER
router.patch('/reqacc/:username/:path', userAccessController.reqacc_patch)
    
  
//FILE OR DIRECTORY ACCESS CHECK - TO REDIRECT FROM NOACCESS PAGE
router.get('/:username/:path', userAccessController.access_get)
  
module.exports = router;
