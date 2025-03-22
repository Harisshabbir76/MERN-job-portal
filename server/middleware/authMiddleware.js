const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        console.log("Received Token:", token); // Debugging

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        req.user = user; // ✅ Set the user object
        next();
    } catch (error) {
        console.error("Middleware Error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
