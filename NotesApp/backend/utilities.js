const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Make sure to load environment variables
dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!authHeader) {
        console.error("No Authorization header sent");
        return res.sendStatus(401);
    }

    if (!token) {
        console.error("No token found in Authorization header");
        return res.sendStatus(401);
    }

    // Debugging logs
    console.log("Token:", token);
    console.log("Secret:", process.env.ACCESS_TOKEN_SECRET);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            console.error("JWT Error:", err.name, err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ error: "Token expired" });
            }
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { authenticateToken };
