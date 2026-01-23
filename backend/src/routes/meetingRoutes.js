const express = require("express");
const {
  createMeetingID,
  joinMeeting,
  myMeetingController,
} = require("../controllers/meeting.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createMeetingID);
router.get("/myMeeting", authMiddleware, myMeetingController);
router.post("/join/:meetingID", authMiddleware, joinMeeting);

module.exports = router;
