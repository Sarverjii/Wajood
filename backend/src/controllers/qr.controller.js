const {
  scanQRService,
  saveContactService,
  saveByPersonalCodeService,
} = require("../services/qr.service.js");

const ScanQR = async (req, res) => {
  try {
    const { qrValue } = req.body;
    const scannerUser = req.user;

    if (!qrValue) {
      return res.status(400).json({
        success: false,
        message: "QR value is required",
      });
    }

    const result = await scanQRService({
      qrValue,
      scannerUser,
    });

    return res.status(200).json({
      success: true,
      message: "QR scanned successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const SaveContact = async (req, res) => {
  try {
    const scannerUser = req.user; // authenticated user
    const { contactUserId, connectPlace, shareContact } = req.body;

    if (!contactUserId) {
      return res.status(400).json({
        success: false,
        message: "Contact user ID is required",
      });
    }

    const result = await saveContactService({
      scannerUser,
      contactUserId,
      connectPlace,
      shareContact,
    });

    return res.status(201).json({
      success: true,
      message: "Contact saved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const saveByPersonalCode = async (req, res) => {
  try {
    const scannerUser = req.user;
    const { personalCode, shareContact, connectPlace } = req.body;

    if (!personalCode) {
      return res.status(400).json({
        success: false,
        message: "Personal code is required",
      });
    }

    const result = await saveByPersonalCodeService({
      scannerUser,
      personalCode,
      shareContact,
      connectPlace,
    });

    return res.status(200).json({
      success: true,
      message: "Connection created via personal code",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { ScanQR, SaveContact, saveByPersonalCode };
