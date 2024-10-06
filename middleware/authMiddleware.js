const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided, authorization denied" });
  }
  try {
    // verify token
    const decoded = jwt.verify(token.split(" ")[1], "yourSecretKey");
    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
