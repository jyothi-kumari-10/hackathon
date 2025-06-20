const bcrypt = require("bcrypt");
const { Admins } = require("../models");
const { v4: uuidv4 } = require("uuid");

async function createDefaultAdmin() {
  const email = "admin1@vipraco.com";
  const password = "Admin@1234";
  const name = "Super Admin";
  const admin_id = uuidv4();
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const existing = await Admins.findOne({ where: { email } });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }
    await Admins.create({ admin_id, email, password_hash, name });
    console.log("Default admin created:");
    console.log({ email, password, name });
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createDefaultAdmin(); 