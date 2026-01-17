const {
  saveApproveService,
  shareApproveService,
} = require("../services/approval.service.js");

const saveApprove = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const user = req.user;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    const result = await saveApproveService({
      connectionId,
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Contact saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Save Approve Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const shareApprove = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const user = req.user;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    const result = await shareApproveService({
      connectionId,
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Contact shared successfully",
      data: result,
    });
  } catch (error) {
    console.error("Share Approve Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveApprove,
  shareApprove,
};
