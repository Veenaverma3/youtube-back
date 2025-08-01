const express = require('express');
const router = express.Router();
const videoController = require('../Controllers/videoController');
 const auth = require('../middleware/Authentication')

router.post('/upload',auth,videoController.uploadVideo);
router.get('/allvideo',videoController.getAllVideos);
router.get('/getvideobyid/:id',videoController.getVideoById);
router.get('/:userId/channel',videoController.getVideosByUserId);
 router.delete("/delete/:id", auth, videoController.deleteVideo);
  


module.exports = router;