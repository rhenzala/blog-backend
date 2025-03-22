const prisma = require("../prisma/prismaClient");

exports.getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: { select: { username: true } }, 
                comments: true
            },
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { 
                id: req.params.id,
                published: true 
            },
            include: {
                author: { select: { username: true } }, 
                comments: true
            },
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: req.params.id },
            include: {
                author: { select: { username: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};