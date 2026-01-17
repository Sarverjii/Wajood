const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const UserModel = require("../models/User.model");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "name email mobile designation company companyWebsite linkedinProfile personalCode personalLinks pcAutoApprove pcAutoCounterSave pcShareOnlyEmail pcShareOnlyMobile"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
