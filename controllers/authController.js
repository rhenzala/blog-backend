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
    try {
        const user = await prisma.user.findUnique({ where: { username } });

        console.log("User found:", user); // Check if user is retrieved
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch); // Check if passwords match

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.json({ token: generateToken(user.id) });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.getMe = async (req, res) => {
    res.json(req.user);
}