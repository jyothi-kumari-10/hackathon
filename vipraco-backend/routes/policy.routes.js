const express = require("express");
const router = express.Router();
const db = require("../models");
const { fn, col } = require("sequelize"); // ✅ required for LOWER()

// GET /api/policies/:org_id
router.get("/:org_id", async (req, res) => {
  const orgId = req.params.org_id;
  console.log("Received orgId:", orgId); // ✅ Debugging

  try {
    const policies = await db.CompanyPolicies.findAll({
      where: db.Sequelize.where(
        fn("LOWER", col("organization_id")),
        orgId.toLowerCase()
      )
    });

    if (!policies || policies.length === 0) {
      return res.status(404).json({ error: "No policies found for this organization." });
    }

    res.json(policies);
  } catch (err) {
    console.error("Error fetching policies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
