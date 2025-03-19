const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const generateToken = (id) => {
    jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "3d"});
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });
        res.sendStatus(201).json({ token: generateToken(user.id) });
    } catch (err) {
        res.sendStatus(400).json({ error: err.message});
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username }});
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({token: generateToken(user.id)});
        } else {
            res.sendStatus(401).json({message: "Invalid credentials"});
        }
    } catch (err) {
        res.sendStatus(400).json({error: err.message});
    }
}

exports.getMe = async (req, res) => {
    res.json(req.user);
}