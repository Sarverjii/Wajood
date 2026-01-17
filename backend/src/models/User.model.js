const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    photo: {
      type: String,
      default: "",
    },

    // Professional Info
    company: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    linkedinProfile: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },

    // Links & QR
    personalLinks: [
      {
        type: String,
      },
    ],
    qrLink: {
      type: String,
      default: "",
    },

    // Personal Code
    personalCode: {
      type: String,
      default: "",
    },

    // Privacy / Preferences (1 = true, 0 = false)
    pcShareOnlyMobile: {
      type: Boolean,
      default: false,
    },
    pcShareOnlyEmail: {
      type: Boolean,
      default: false,
    },
    pcAutoApprove: {
      type: Boolean,
      default: false,
    },
    pcAutoCounterSave: {
      type: Boolean,
      default: false,
    },

    // Account Type
    isCompany: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
