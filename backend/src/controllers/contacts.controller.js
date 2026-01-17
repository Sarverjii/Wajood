const {
  getContactListService,
  getSaveApproveListService,
  getShareApproveListService,
} = require("../services/contacts.service.js");

const getContactList = async (req, res) => {
  try {
    const userId = req.user._id;

    const contacts = await getContactListService(userId);

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contact List Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contacts",
    });
  }
};

const getSaveApproveList = async (req, res) => {
  try {
    const userId = req.user._id;

    const list = await getSaveApproveListService(userId);

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Get Save Approve List Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch save approvals",
    });
  }
};

const getShareApproveList = async (req, res) => {
  try {
    const userId = req.user._id;

    const list = await getShareApproveListService(userId);

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Get Share Approve List Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch share approvals",
    });
  }
};

module.exports = { getContactList, getSaveApproveList, getShareApproveList };
