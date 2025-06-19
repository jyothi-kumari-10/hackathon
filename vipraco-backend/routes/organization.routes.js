const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /api/organizations
router.get("/", async (req, res) => {
  try {
    const orgs = await db.Organizations.findAll();
    res.json(orgs);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
