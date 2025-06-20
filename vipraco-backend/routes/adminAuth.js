const express = require("express");
const router = express.Router();
const { Admins } = require("../models");
const bcrypt = require("bcrypt");

// Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admins.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid password" });
    return res.json({ success: true, adminId: admin.admin_id, name: admin.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
