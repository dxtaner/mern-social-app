const Notification = require("../models/Notification");
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
    let updateData = { ...req.body };

    if (req.files && req.files.profilePic) {
      updateData.profilePic = req.files.profilePic[0].filename;
    }

    if (req.files && req.files.coverPic) {
      updateData.coverPic = req.files.coverPic[0].filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
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
  const targetUserId = req.params.id;
  const currentUserId = req.user?.id;

  try {
    if (!currentUserId) {
      return res.status(401).json("No user info");
    }

    if (currentUserId === targetUserId) {
      return res.status(403).json("You cannot follow yourself");
    }

    const user = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json("User not found");
    }

    const isAlreadyFollowing = user.followers
      .map((id) => id.toString())
      .includes(currentUserId);

    if (!isAlreadyFollowing) {
      await user.updateOne({ $push: { followers: currentUserId } });
      await currentUser.updateOne({ $push: { following: targetUserId } });

      try {
        const newNotification = await Notification.create({
          senderId: currentUserId,
          receiverId: targetUserId,
          type: "follow",
        });
      } catch (notifErr) {
        console.error(
          "KRİTİK HATA: Bildirim oluşturulurken hata alındı!",
          notifErr.message,
        );
      }
      return res.status(200).json("User followed");
    } else {
      return res.status(400).json("Already following");
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
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
