const video = require("../Models/video");
const User = require("../Models/user"); // make sure this is imported at the top

//  upload video
exports.uploadVideo = async (req, res) => {
  try {
    console.log("req.user =>", req.user);
     const { title, description, videoFile, category, thumbnail } = req.body;
     console.log(req.user.userId)

    const videoUpload = new video({
      user: req.user.userId, 
      // use the userId from the authenticated user
      title,
      description,
      videoFile,
      category: category.trim().toLowerCase(),
      thumbnail,
    });
    await videoUpload.save();

    res
      .status(201)
      .json({ message: "Video uploaded successfully", video: videoUpload });
  } catch (error) {
    console.error("Upload Video Error:", error);
    res.status(500).json({ error: "Server error during video upload" });
  }
};

//  get all video like home page video
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await video
      .find()
      .populate("user", "channelName profilePic userName createdAt");
    res.status(200).json(videos);
  } catch (error) {
    console.error("Get Videos Error:", error);
    res.status(500).json({ error: "Server error while fetching videos" });
  }
};

// get video by id when we click on video in home page
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params; // ✅ extract the id from params

    const foundVideo = await video
      .findById(id)
      .populate("user", "channelName profilePic userName createdAt");

    if (!foundVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json({ success: true, video: foundVideo });
  } catch (error) {
    console.error("Get Video By ID Error:", error);
    res.status(500).json({ error: "Server error while fetching video" });
  }
};

// see particular user's videos

exports.getVideosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ First fetch the user
    const user = await User.findById(userId).select(
      "channelName profilePic userName createdAt about"
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // ✅ Then fetch the videos
    const videos = await video
      .find({ user: userId })
      .populate("user", "channelName profilePic userName createdAt about");

    // ✅ Now safely return response
    res.status(200).json({ success: true, user, videos });
  } catch (error) {
    console.error("Get Videos by User Error:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching user's videos" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId; // from Authentication middleware

    const foundVideo = await video.findById(videoId);

    if (!foundVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (foundVideo.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this video" });
    }

    await foundVideo.deleteOne();
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ error: "Server error while deleting video" });
  }
};
