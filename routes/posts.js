const { Router } = require("express");
const router = Router();
const { getPosts, createPost, updatePost, deletePost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.patch("/:id/publish", protect, updatePostStatus);



module.exports = router;