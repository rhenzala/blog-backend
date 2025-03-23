const { Router } = require("express");
const router = Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout)

module.exports = router;