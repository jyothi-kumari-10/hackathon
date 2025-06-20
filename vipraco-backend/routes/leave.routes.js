const express = require("express");
const router = express.Router();
const db = require("../models");
const leaveController = require("../controllers/leave.controller");


// GET /api/leaves/:user_id
router.get("/:user_id", async (req, res) => {
  const userId = req.params.user_id;


  try {
    const leaveBalances = await db.LeaveBalances.findAll({
      where: { user_id: userId }
    });


    if (!leaveBalances || leaveBalances.length === 0) {
      return res.status(404).json({ error: "No leave data found for this user." });
    }


    res.json(leaveBalances);
  } catch (err) {
    console.error("Error fetching leave balances:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// POST /api/leaves/apply
router.post("/apply", leaveController.applyLeave);


module.exports = router;
