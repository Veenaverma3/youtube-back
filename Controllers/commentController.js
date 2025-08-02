 const Comment = require('../Models/comment');

// Add a comment to a video
module.exports.addComment = async (req, res) => {
  try {
      const { videoId, message } = req.body;
    const comment = new Comment({ user: req.user._id, videoId, message });
    await comment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding comment" });
  }
};

// Get comments by video ID
module.exports.getCommentsByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate('user', 'channelName userName profilePic createdAt')
      .sort({ createdAt: -1 }); // latest comments first

    res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
};