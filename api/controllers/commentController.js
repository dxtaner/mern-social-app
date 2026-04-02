const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json("Post Not Found");

    const newComment = new Comment({
      userId: req.user.id,
      postId: req.body.postId,
      desc: req.body.desc,
    });

    const savedComment = await newComment.save();

    try {
      if (post.userId.toString() !== req.user.id) {
        await Notification.create({
          senderId: req.user.id,
          receiverId: post.userId,
          type: "comment",
          postId: post._id,
        });
      }
    } catch (nErr) {
      console.log("The notification could not be created:", nErr.message);
    }

    res.status(200).json(savedComment);
  } catch (err) {
    console.error("Comments Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.userId === req.user.id) {
      await comment.deleteOne();

      res.status(200).json("Comment deleted");
    } else {
      res.status(403).json("You can delete only your comment");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};
