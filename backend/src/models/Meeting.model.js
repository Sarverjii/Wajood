const mongoose = require("mongoose");

function generateMeetingID(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const meetingSchema = new mongoose.Schema(
  {
    meetingID: {
      type: String,
      required: true,
      unique: true,
      default: () => generateMeetingID(6),
    },

    meetingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    meetingMode: {
      type: String,
      enum: ["In-Person", "Video Call"],
      default: "In-Person",
    },

    meetingLocation: {
      type: String,
      default: null, // VC meetings may not need location
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    joined: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Meeting", meetingSchema);
