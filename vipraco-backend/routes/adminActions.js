const express = require("express");
const router = express.Router();
const { Organizations, Users } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Get all organizations for admin view
router.get("/organizations", async (req, res) => {
  try {
    const organizations = await Organizations.findAll({
      attributes: ['organization_id', 'org_name']
    });
    res.json(organizations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching organizations" });
  }
});

// Get all users with organization names for admin view
router.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['user_id', 'first_name', 'last_name', 'organization_id'],
      include: [{
        model: Organizations,
        as: 'organization',
        attributes: ['org_name']
      }]
    });
    
    // Transform the data to include org_name directly
    const transformedUsers = users.map(user => ({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      organization_id: user.organization_id,
      org_name: user.organization ? user.organization.org_name : 'Unknown Organization'
    }));
    
    res.json(transformedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

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
