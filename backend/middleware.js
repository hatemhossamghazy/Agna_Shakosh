// middleware/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access denied! Token missing");

  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}


function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have permission" });
        }
        next();
    }
}

module.exports = { authenticateToken, authorizeRoles };