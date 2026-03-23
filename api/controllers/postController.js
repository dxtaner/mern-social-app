const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      desc: req.body.desc,
      img: req.file ? req.file.filename : req.body.img,
    });

    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.user.id) {
      await post.deleteOne();

      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({
        $push: { likes: req.user.id },
      });

      await getNotifications.create({
        senderId: req.user.id,
        receiverId: post.userId,
        type: "like",
        postId: post._id,
      });

      res.status(200).json("Post liked");
    } else {
      await post.updateOne({
        $pull: { likes: req.user.id },
      });

      res.status(200).json("Post unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const userPosts = await Post.find({
      userId: req.user.id,
    });

    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
