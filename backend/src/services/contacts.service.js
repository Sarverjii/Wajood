const Connection = require("../models/Connection.model");

const getContactListService = async (userId) => {
  const connections = await Connection.find({
    user_id: userId,
    saveApproved: true,
    shareApproved: true,
  })
    .populate({
      path: "user_idContact",
      select:
        "_id name email mobile designation photo company companyWebsite linkedinProfile personalLinks",
    })
    .sort({ createdAt: -1 });

  // Optional: flatten response for frontend
  return connections.map((conn) => ({
    connectionId: conn._id,
    approved: conn.approved,
    connectDate: conn.connectDate,
    connectPlace: conn.connectPlace,
    connectMode: conn.connectMode,
    contact: conn.user_idContact,
  }));
};

/**
 * Contacts saved by me but not yet approved
 * user_id = me
 * saveApproved = false
 */
const getSaveApproveListService = async (userId) => {
  const connections = await Connection.find({
    user_id: userId,
    saveApproved: false,
  })
    .populate({
      path: "user_idContact",
      select:
        "_id name email mobile designation photo company companyWebsite linkedinProfile personalLinks",
    })
    .sort({ createdAt: -1 });

  return connections.map((conn) => ({
    connectionId: conn._id,
    connectDate: conn.connectDate,
    connectPlace: conn.connectPlace,
    connectMode: conn.connectMode,
    contact: conn.user_idContact,
  }));
};

/**
 * Contacts where someone saved me and wants to share contact
 * user_idContact = me
 * shareApproved = false
 */
const getShareApproveListService = async (userId) => {
  const connections = await Connection.find({
    user_idContact: userId,
    shareApproved: false,
  })
    .populate({
      path: "user_id",
      select:
        "_id name email mobile designation photo company companyWebsite linkedinProfile personalLinks",
    })
    .sort({ createdAt: -1 });

  return connections.map((conn) => ({
    connectionId: conn._id,
    connectDate: conn.connectDate,
    connectPlace: conn.connectPlace,
    connectMode: conn.connectMode,
    requester: conn.user_id,
  }));
};

module.exports = {
  getContactListService,
  getSaveApproveListService,
  getShareApproveListService,
};
