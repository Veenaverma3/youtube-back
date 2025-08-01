const mongoose = require('mongoose')
const videoSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videoFile:{
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default:"All"
    },
   likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
  ],
     dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('video', videoSchema);

