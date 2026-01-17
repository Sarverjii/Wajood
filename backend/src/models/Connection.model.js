const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    user_idContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    connectDate: {
      type: Date,
      default: Date.now,
    },

    connectPlace: {
      type: String,
      trim: true,
    },

    connectMode: {
      type: String,
      enum: ["in-person", "VC", "through someone", "personalCode"],
      required: true,
    },
    shareApproved: {
      type: Boolean,
      default: true,
    },
    saveApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.index({ user_id: 1, user_idContact: 1 }, { unique: true });

module.exports = mongoose.model("Connection", connectionSchema);
