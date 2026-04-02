const router = require("express").Router();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/all", verifyToken, postController.getAllPosts);

router.get("/:id", verifyToken, postController.getPostById);

router.post("/", verifyToken, upload.single("img"), postController.createPost);

router.delete("/:id", verifyToken, postController.deletePost);

router.put("/like/:id", verifyToken, postController.likePost);

router.get("/feed", verifyToken, postController.getFeed);

module.exports = router;
