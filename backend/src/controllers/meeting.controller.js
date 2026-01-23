const { createMeetingIDService } = require("../services/meeting.service");
const Connection = require("../models/Connection.model.js");
const Meeting = require("../models/Meeting.model.js");

const createMeetingID = async (req, res) => {
  try {
    const user = req.user;
    const meetingLocation = req.body.meetingLocation;
    const meetingMode = req.body.meetingMode;

    const meeting = await createMeetingIDService(
      meetingLocation,
      meetingMode,
      user,
    );

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: {
        meetingID: meeting.meetingID,
        meetingId: meeting._id,
        participants: meeting.participants,
        joined: meeting.joined,
      },
      userId: user._id,
    });
  } catch (error) {
    console.error("Create Meeting Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const joinMeeting = async (req, res) => {
  try {
    const { meetingID } = req.params;
    const user = req.user;

    const meeting = await Meeting.findOne({ meetingID });
    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    const alreadyJoined = meeting.joined.find(
      (p) => p.user.toString() === user._id,
    );

    if (!alreadyJoined) {
      const existingParticipants = meeting.participants;

      for (const p of existingParticipants) {
        if (p.user.toString() === user._id.toString()) continue;

        // 🔹 check new -> old
        const exists1 = await Connection.findOne({
          user_id: user._id,
          user_idContact: p.user,
        });

        if (!exists1) {
          await Connection.create({
            user_id: user._id,
            user_idContact: p.user,
            connectMode: "in-person",
            shareApproved: false,
            saveApproved: false,
          });
        }

        // 🔹 check old -> new
        const exists2 = await Connection.findOne({
          user_id: p.user,
          user_idContact: user._id,
        });

        if (!exists2) {
          await Connection.create({
            user_id: p.user,
            user_idContact: user._id,
            connectMode: "in-person",
            shareApproved: false,
            saveApproved: false,
          });
        }
      }

      // 🔹 now add to meeting
      meeting.joined.push({
        user: user._id,
        name: user.name,
      });

      meeting.participants.push({
        user: user._id,
        name: user.name,
      });

      await meeting.save();
    }

    res.json({
      success: true,
      joined: meeting.joined,
      userId: user._id,
    });
  } catch (err) {
    console.error("Join meeting error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

const myMeetingController = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ correct

    const meetings = await Meeting.find({
      $or: [{ "participants.user": userId }, { "joined.user": userId }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    console.error("My Meeting Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createMeetingID, joinMeeting, myMeetingController };
