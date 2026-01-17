const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Validate decoded payload
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded.userId).select(
      "_id name email mobile designation photo company companyWebsite linkedinProfile personalLinks"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 6️⃣ Attach verified user to request
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
      photo: user.photo,
      company: user.company,
      companyWebsite: user.companyWebsite,
      linkedinProfile: user.linkedinProfile,
      personalLinks: user.personalLinks,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
