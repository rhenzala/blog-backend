const prisma = require("../prisma/prismaClient");


exports.getPosts = async (req, res) => {
    try {
        let posts;
        if (req.user && req.user.role === "ADMIN") {
            posts = await prisma.post.findMany({
                include: {
                    author: { select: { username: true } }, 
                    comments: true
                },
            });
        } else {
            posts = await prisma.post.findMany({
                where: { published: true},
                include: {
                    author: { select: { username: true } }, 
                    comments: true
                },
            })
        }
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getPostById = async (req, res) => {
    try {
        let post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                author: { select: { username: true } }, 
                comments: true
            },
        });
        
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createPost = async (req, res) => {
    const { title, content, published } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published || false,
                authorId: req.user.id,
            }
        });
        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: err.message });
    }
}

exports.updatePost = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({message: "Unauthorized"});
    const post = await prisma.post.update({ 
        where: { id: req.params.id},
        data: req.body
    });
    res.json(post);
}

exports.deletePost = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({message: "Unauthorized"});
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: "Post deleted"});
}

exports.updatePostStatus = async (req, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Not authorized" });
  
    try {
      const post = await prisma.post.update({
        where: { id: req.params.id },
        data: { published: req.body.published },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  