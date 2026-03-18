const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      userId: req.user.id,
      postId: req.body.postId,
      desc: req.body.desc,
    });

    const savedComment = await newComment.save();

    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
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
