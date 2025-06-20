const express = require("express");
const router = express.Router();
const { Organizations, Users } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Add Organization
router.post("/organization", async (req, res) => {
  const { organization_id, org_name, subscription_plan } = req.body;
  try {
    const orgId = organization_id && organization_id.trim() !== "" ? organization_id : uuidv4();
    const org = await Organizations.create({ organization_id: orgId, org_name, subscription_plan });
    res.json({ success: true, org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding organization" });
  }
});

// Remove Organization
router.delete("/organization/:orgId", async (req, res) => {
  try {
    const orgId = req.params.orgId;
    await Organizations.destroy({ where: { organization_id: orgId } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error removing organization" });
  }
});

// Add Employee
router.post("/employee", async (req, res) => {
  const { user_id, organization_id, first_name, last_name, email, password, role, manager_id, date_of_joining, department, location } = req.body;
  try {
    const empId = user_id && user_id.trim() !== "" ? user_id : uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    const user = await Users.create({ user_id: empId, organization_id, first_name, last_name, email, password_hash, role, manager_id, date_of_joining, department, location });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding employee" });
  }
});

// Remove Employee
router.delete("/employee/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await Users.destroy({ where: { user_id: userId } });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error removing employee" });
  }
});

module.exports = router;
