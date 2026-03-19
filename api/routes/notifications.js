const router = require("express").Router();
const notificationController = require("../controllers/notificationController.js");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, notificationController.getNotifications);

router.put("/:id", verifyToken, notificationController.readNotification);

module.exports = router;
