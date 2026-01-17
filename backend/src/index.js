const express = require("express");
const dotenv = require("dotenv/config");
const app = express();

const connectDB = require("./lib/db.js");

const authRoutes = require("./routes/authRoutes.js");
const qrRoutes = require("./routes/qrRoutes.js");
const contactsRoutes = require("./routes/contactsRoutes.js");
const approvalRoutes = require("./routes/approvalRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const PORT = process.env.PORT || 6000;
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/approval/", approvalRoutes);

app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Wajood server running on port ${PORT}`);
});
