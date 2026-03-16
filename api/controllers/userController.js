const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// kullanıcı sil
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// follow user
exports.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });

        await currentUser.updateOne({
          $push: { following: req.params.id },
        });

        res.status(200).json("User followed");
      } else {
        res.status(403).json("Already following");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
};

// unfollow user
exports.unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: { followers: req.body.userId },
        });

        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });

        res.status(200).json("User unfollowed");
      } else {
        res.status(403).json("You are not following this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
};
