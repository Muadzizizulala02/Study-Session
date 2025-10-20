// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    // Check if the token is sent in the headers and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer a.b.c" -> "a.b.c")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token's payload
            // Attach the user object to the request, but exclude the password
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move on to the next function (the actual route controller)
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };