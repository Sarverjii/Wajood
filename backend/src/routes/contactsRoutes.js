const express = require("express");
const {
  getContactList,
  getSaveApproveList,
  getShareApproveList,
  removeSavedContact,
} = require("../controllers/contacts.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/saved", authMiddleware, getContactList);
router.get("/save-approve", authMiddleware, getSaveApproveList);
router.get("/share-approve", authMiddleware, getShareApproveList);

router.post("/remove-saved", authMiddleware, removeSavedContact);

module.exports = router;
