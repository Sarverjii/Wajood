const Meeting = require("../models/Meeting.model");
const User = require("../models/User.model.js");

const createMeetingIDService = async (meetingLocation, meetingMode, user) => {
  if (!user?._id) {
    throw new Error("User not found");
  }

  const dbUser = await User.findById(user._id);
  if (!dbUser) throw new Error("User not found");

  const meeting = await Meeting.create({
    meetingLocation,
    meetingMode,
    participants: [
      {
        user: user._id,
        name: user.name,
      },
    ],
    joined: [
      {
        user: user._id,
        name: user.name,
      },
    ],
  });

  return meeting;
};

module.exports = { createMeetingIDService };
