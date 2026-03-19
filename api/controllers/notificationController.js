const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiverId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readNotification = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.status(200).json("Notification marked as read");
  } catch (err) {
    res.status(500).json(err);
  }
};
