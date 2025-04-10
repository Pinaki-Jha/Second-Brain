const express = require('express')
const dirFileController = require('../controllers/dirFileController')

const router = express.Router();


//FILE OR DIRECTORY CREATION - FUNCTIONAL 
router.post('/:username/:path',dirFileController.dirfile_post)
  
//FILE OR DIRECTORY DELETION 
router.delete('/:username/:path', dirFileController.dirfile_delete)

//FILE OR DIRECTORY FETCHING - FUNCTIONAL
router.get('/:username/:path*', dirFileController.dirfile_get)




module.exports = router;
