const router = require("express").Router();
const userController = require("../controllers/userController");

// get user
router.get("/:id", userController.getUser);

// update user
router.put("/:id", userController.updateUser);

// delete user
router.delete("/:id", userController.deleteUser);

// follow
router.put("/:id/follow", userController.followUser);

// unfollow
router.put("/:id/unfollow", userController.unfollowUser);

module.exports = router;
