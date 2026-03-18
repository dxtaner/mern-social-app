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

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.followUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json("No user info");
    }

    if (req.user.id === req.params.id) {
      return res.status(403).json("You cannot follow yourself");
    }

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user || !currentUser) {
      return res.status(404).json("User not found");
    }

    if (!user.followers.includes(req.user.id)) {
      await user.updateOne({
        $push: { followers: req.user.id },
      });

      await currentUser.updateOne({
        $push: { following: req.params.id },
      });

      res.status(200).json("User followed");
    } else {
      res.status(400).json("Already following");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json("You cannot unfollow yourself");
    }

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (user.followers.includes(req.user.id)) {
      await user.updateOne({
        $pull: { followers: req.user.id },
      });

      await currentUser.updateOne({
        $pull: { following: req.params.id },
      });

      res.status(200).json("User unfollowed");
    } else {
      res.status(400).json("You are not following this user");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
