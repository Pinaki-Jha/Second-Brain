const express = require('express')
const multer = require("multer");
const fileContentController = require('../controllers/fileContentController')


const router = express.Router();




const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/upload-image", upload.single("image"), fileContentController.upload_image_post)


// GET CONTENTS OF THE FILE
router.get('/:username/:path',fileContentController.filecontent_get)
  
// SAVE THE CONTENTS OF THE FILE
router.patch('/:username/:path',fileContentController.filecontent_patch)

module.exports = router;

  