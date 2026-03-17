const router = require("express").Router();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, postController.createPost);

router.delete("/:id", verifyToken, postController.deletePost);

router.put("/like/:id", verifyToken, postController.likePost);

router.get("/feed", verifyToken, postController.getFeed);

module.exports = router;
