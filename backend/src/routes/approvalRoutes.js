const express = require("express");
const {
  saveApprove,
  shareApprove,
} = require("../controllers/approval.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Approve saving someone else's contact
router.post("/save", authMiddleware, saveApprove);

// Approve sharing your contact
router.post("/share", authMiddleware, shareApprove);

module.exports = router;
