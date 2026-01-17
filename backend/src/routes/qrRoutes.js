const express = require("express");
const {
  ScanQR,
  SaveContact,
  saveByPersonalCode,
} = require("../controllers/qr.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/scan", authMiddleware, ScanQR);
router.post("/save", authMiddleware, SaveContact);
router.post("/personalcode", authMiddleware, saveByPersonalCode);

module.exports = router;
