const express = require('express');
const router = express.Router();
const CommentController = require('../Controllers/commentController');
const auth = require('../middleware/Authentication')

router.post('/comment',auth, CommentController.addComment);
router.get('/comments/:videoId', CommentController.getCommentsByVideoId);

module.exports = router;