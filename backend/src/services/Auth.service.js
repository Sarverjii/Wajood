const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/* ================= REGISTER ================= */
const registerUser = async (data) => {
  const { name, email, mobile, password } = data;

  if (!name || !email || !mobile || !password) {
    throw new Error("Name, Email, Mobile and Password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    throw new Error("User already exists with this email or mobile");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    mobile,
    password: hashedPassword,
    photo: "",
    company: data.company || "",
    designation: data.designation || "",
    linkedinProfile: data.linkedinProfile || "",
    companyWebsite: data.companyWebsite || "",
    personalLinks: data.personalLinks || [],
    personalCode: email,
  });

  await user.save();
  return true;
};

/* ================= LOGIN ================= */
const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
    },
    qrCode: user._id,
  };
};

module.exports = { registerUser, loginUser };
