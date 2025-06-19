const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
