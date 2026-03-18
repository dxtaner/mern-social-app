const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:id", verifyToken, userController.getUser);

router.put("/:id", verifyToken, userController.updateUser);

router.delete("/:id", verifyToken, userController.deleteUser);

router.put("/follow/:id", verifyToken, userController.followUser);

router.put("/unfollow/:id", verifyToken, userController.unfollowUser);

module.exports = router;
