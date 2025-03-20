const { Router } = require("express");
const router = Router();
const { getComments, createComment, updateComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");


router.get("/:postId", getComments);
router.post("/:postId", protect, createComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;