const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json("Not authenticated");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(403).json("Token invalid");
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    res.status(500).json("Server error");
  }
};

module.exports = verifyToken;
