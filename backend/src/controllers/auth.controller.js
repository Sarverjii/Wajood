const { registerUser, loginUser } = require("../services/Auth.service");

/* ================= REGISTER ================= */
const Register = async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= LOGIN ================= */
const Login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: data.user,
      qrCode: data.qrCode,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { Register, Login };
