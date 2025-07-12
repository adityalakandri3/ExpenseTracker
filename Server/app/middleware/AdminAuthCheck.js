const jwt = require("jsonwebtoken");

const AdminAuthCheck = (req, res, next) => {
  const token = req.cookies?.adminToken;
  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      console.log("JWT verify failed:", err.message);
      req.user = null;
      return next();
    }
    req.user = data.user; 
    next();
  });
};

module.exports = AdminAuthCheck;
