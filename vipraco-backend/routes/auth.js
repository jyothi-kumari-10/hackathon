const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    if (user.password_hash !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    return res.json({ success: true, userId: user.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
