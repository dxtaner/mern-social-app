const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/all", verifyToken, userController.getAllUsers);

router.get("/:id", verifyToken, userController.getUser);

router.put(
  "/:id",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  userController.updateUser,
);

router.delete("/:id", verifyToken, userController.deleteUser);

router.put("/follow/:id", verifyToken, userController.followUser);

router.put("/unfollow/:id", verifyToken, userController.unfollowUser);

module.exports = router;
