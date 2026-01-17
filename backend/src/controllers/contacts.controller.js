const {
  getContactListService,
  getSaveApproveListService,
  getShareApproveListService,
  removeSavedContactService,
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

const removeSavedContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contactUserId } = req.body;

    if (!contactUserId) {
      return res.status(400).json({
        success: false,
        message: "Contact user ID is required",
      });
    }

    await removeSavedContactService(userId, contactUserId);

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting contact",
    });
  }
};

module.exports = {
  getContactList,
  getSaveApproveList,
  getShareApproveList,
  removeSavedContact,
};
