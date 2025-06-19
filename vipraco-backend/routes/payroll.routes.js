const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /api/payroll/:user_id
router.get("/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    const payroll = await db.PayrollData.findOne({
      where: { user_id: userId }
    });

    if (!payroll) {
      return res.status(404).json({ error: "Payroll not found for this user." });
    }

    res.json(payroll);
  } catch (err) {
    console.error("Error fetching payroll:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
