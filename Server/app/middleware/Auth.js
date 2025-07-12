const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hashing the password
const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

// Matching the password
const matchPassword = async (password, existingPassword) => {
  const isMatch = await bcrypt.compare(password, existingPassword);
  return isMatch;
};

// Auth middleware
const AuthCheck = async (req, res, next) => {
  let token =
    req.cookies?.token ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(400).json({
      status: false,
      message: "Token is required for verification",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // decoded should include id, role, etc.
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Invalid Token, ${error.message}`,
    });
  }
};

// Role check middleware
const RoleCheck = (roles = []) => {
  return async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: "Access Denied. You are not authorized.",
      });
    }
    next();
  };
};

module.exports = { hashedPassword, matchPassword, AuthCheck, RoleCheck };
