const prisma = require("../prisma/prismaClient");

exports.getComments = async (req, res) => {
  const comments = await prisma.comment.findMany({ 
    where: { postId: req.params.postId },
    include: {
      author: { select: { username: true } }
  },
  });
  res.json(comments);
};

exports.createComment = async (req, res) => {
  const { content } = req.body;
  const comment = await prisma.comment.create({
    data: { content, authorId: req.user.id, postId: req.params.postId },
  });
  res.status(201).json(comment);
};

exports.updateComment = async (req, res) => {
  const comment = await prisma.comment.update({
    where: { id: req.params.id, authorId: req.user.id },
    data: req.body,
  });
  res.json(comment);
};

exports.deleteComment = async (req, res) => {
  await prisma.comment.delete({ where: { id: req.params.id, authorId: req.user.id } });
  res.json({ message: "Comment deleted" });
};
