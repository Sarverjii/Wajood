const mongoose = require("mongoose");
const User = require("../models/User.model.js");
const Connection = require("../models/Connection.model.js");

const scanQRService = async ({ qrValue, scannerUser }) => {
  // 1️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(qrValue)) {
    throw new Error("Invalid QR code");
  }

  // 2️⃣ Fetch QR owner
  const qrUser = await User.findById(qrValue).select(
    "name email mobile designation photo company companyWebsite linkedinProfile personalLinks"
  );

  if (!qrUser) {
    throw new Error("User not found for this QR code");
  }

  // 3️⃣ Prevent self-scan (FIXED)
  if (scannerUser?._id.toString() === qrUser._id.toString()) {
    throw new Error("You cannot scan your own QR code");
  }

  const primaryConnection = await Connection.findOne({
    user_id: scannerUser._id,
    user_idContact: qrUser,
  });

  if (primaryConnection) {
    throw new Error("You Already Have this Contact.");
  }
  // 4️⃣ Return plain object
  return {
    _id: qrUser._id,
    name: qrUser.name,
    email: qrUser.email,
    mobile: qrUser.mobile,
    designation: qrUser.designation,
    photo: qrUser.photo,
    company: qrUser.company,
    companyWebsite: qrUser.companyWebsite,
    linkedinProfile: qrUser.linkedinProfile,
    personalLinks: qrUser.personalLinks,
  };
};

const saveContactService = async ({
  scannerUser,
  contactUserId,
  connectPlace,
  shareContact,
}) => {
  // 1️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactUserId)) {
    throw new Error("Invalid contact user ID");
  }

  // 2️⃣ Prevent self-save
  if (scannerUser._id.toString() === contactUserId.toString()) {
    throw new Error("You cannot save yourself as a contact");
  }

  // 3️⃣ Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4️⃣ Ensure scanned user exists
    const contactUser = await User.findById(contactUserId).session(session);
    if (!contactUser) {
      throw new Error("Contact user does not exist");
    }

    // 5️⃣ PRIMARY connection (scanner → scanned)
    let primaryConnection = await Connection.findOne({
      user_id: scannerUser._id,
      user_idContact: contactUserId,
    }).session(session);

    if (!primaryConnection) {
      primaryConnection = await Connection.create(
        [
          {
            user_id: scannerUser._id,
            user_idContact: contactUserId,
            connectDate: new Date(),
            connectPlace: connectPlace || "",
            connectMode: "in-person",
            saveApproved: true,
            shareApproved: true,
          },
        ],
        { session }
      );
      primaryConnection = primaryConnection[0];
    }

    let reverseConnection = null;

    // 6️⃣ REVERSE connection (optional)
    if (shareContact) {
      const existingReverse = await Connection.findOne({
        user_id: contactUserId,
        user_idContact: scannerUser._id,
      }).session(session);

      if (!existingReverse) {
        reverseConnection = await Connection.create(
          [
            {
              user_id: contactUserId,
              user_idContact: scannerUser._id,
              connectDate: new Date(),
              connectPlace: connectPlace || "",
              connectMode: "in-person",
              saveApproved: false,
            },
          ],
          { session }
        );
        reverseConnection = reverseConnection[0];
      }
    }

    // 7️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      primaryConnection,
      reverseConnection,
    };
  } catch (error) {
    // ❌ Rollback on any failure
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const saveByPersonalCodeService = async ({
  scannerUser,
  personalCode,
  shareContact,
  connectPlace,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Find personal code owner
    const owner = await User.findOne({ personalCode }).session(session);

    if (!owner) {
      throw new Error("Invalid personal code");
    }

    // 2️⃣ Prevent self usage
    if (owner._id.equals(scannerUser._id)) {
      throw new Error("You cannot use your own personal code");
    }

    // 3️⃣ PRIMARY CONNECTION (scanner → owner)
    let primaryConnection = await Connection.findOne({
      user_id: scannerUser._id,
      user_idContact: owner._id,
    }).session(session);

    if (!primaryConnection) {
      primaryConnection = await Connection.create(
        [
          {
            user_id: scannerUser._id,
            user_idContact: owner._id,
            connectDate: new Date(),
            connectPlace: connectPlace || "",
            connectMode: "personalCode",
            saveApproved: true,
            shareApproved: owner.pcAutoApprove === true,
          },
        ],
        { session }
      );
    }

    let reverseConnection = null;

    // 4️⃣ COUNTER CONNECTION (owner → scanner)
    if (shareContact) {
      const existingReverse = await Connection.findOne({
        user_id: owner._id,
        user_idContact: scannerUser._id,
      }).session(session);

      if (!existingReverse) {
        reverseConnection = await Connection.create(
          [
            {
              user_id: owner._id,
              user_idContact: scannerUser._id,
              connectDate: new Date(),
              connectPlace: connectPlace || "",
              connectMode: "personalCode",
              shareApproved: true,
              saveApproved: owner.pcAutoCounterSave === true,
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    return {
      primaryConnection,
      reverseConnection,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  scanQRService,
  saveContactService,
  saveByPersonalCodeService,
};
