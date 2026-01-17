const mongoose = require("mongoose");
const Connection = require("../models/Connection.model");

/**
 * SAVE APPROVAL
 * User approves saving someone else's contact
 * saveApproved: false → true
 */
const saveApproveService = async ({ connectionId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(connectionId)) {
    throw new Error("Invalid connection ID");
  }

  const connection = await Connection.findOne({
    _id: connectionId,
    user_id: userId,
    saveApproved: false,
  });

  if (!connection) {
    throw new Error("Pending save approval not found");
  }

  connection.saveApproved = true;
  await connection.save();

  return {
    connectionId: connection._id,
    saveApproved: true,
  };
};

/**
 * SHARE APPROVAL
 * User approves sharing their contact
 * shareApproved: false → true
 */
const shareApproveService = async ({ connectionId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(connectionId)) {
    throw new Error("Invalid connection ID");
  }

  const connection = await Connection.findOne({
    _id: connectionId,
    user_idContact: userId,
    shareApproved: false,
  });

  if (!connection) {
    throw new Error("Pending share approval not found");
  }

  connection.shareApproved = true;
  await connection.save();

  return {
    connectionId: connection._id,
    shareApproved: true,
  };
};

module.exports = {
  saveApproveService,
  shareApproveService,
};
