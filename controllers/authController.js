const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "3d"});
};

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, role },
        });
        res.status(201).json({ token: generateToken(user.id) });
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
        where: { username }, 
        select: { id: true, username: true, role: true, password: true } 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id)

    res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role } 
    });
};



exports.getMe = async (req, res) => {
    res.json(req.user);
}

exports.logout = async (req, res) => {
    res.json({ message: "Logged out successfully" });
};
