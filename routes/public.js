const express = require("express");
const router = express.Router();
const { getPosts, getPostById, getComments } = require("../controllers/publicController");


router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/:id/comments", getComments);

module.exports = router;