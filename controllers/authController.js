const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");
const { body, validationResult } = require("express-validator");


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

exports.register = [ 
    body("username").trim()
    .isLength({ min: 1}).withMessage("Username must not be empty."),

    body("email").trim()
    .isEmail().withMessage(`Invalid Email format.`)
    .normalizeEmail(),
    body("password")
        .trim() 
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[@$!%*?&\-.]/).withMessage("Password must contain at least one special character @ $ ! % . - * ? &")
        .escape(), 

    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, confirmPassword, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, role },
        });

        res.status(201).json({ token: generateToken(user.id) });
    } catch (err) {
        res.status(400).json({ error: err.message });
        next(err);
    }
}]

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
        where: { username }, 
        select: { id: true, username: true, role: true, password: true } 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Incorrect username or password" });
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
