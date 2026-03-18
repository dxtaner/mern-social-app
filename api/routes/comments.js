const router = require("express").Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, commentController.addComment);

router.delete("/:id", verifyToken, commentController.deleteComment);

router.get("/:postId", verifyToken, commentController.getComments);

router.get("/", verifyToken, commentController.getAllComments);

module.exports = router;
