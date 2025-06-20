const bcrypt = require("bcrypt");
const { Users } = require("../models"); // adjust path if needed

async function hashAllPlainPasswords() {
  try {
    const users = await Users.findAll();

    for (const user of users) {
      // Only hash if not already hashed (bcrypt hashes start with $2b$ or $2a$)
      if (!user.password_hash.startsWith("$2b$") && !user.password_hash.startsWith("$2a$")) {
        const hash = await bcrypt.hash(user.password_hash, 10); // assumes password_hash holds plain text
        user.password_hash = hash;
        await user.save();
        console.log(`Hashed password for ${user.email}`);
      } else {
        console.log(`Password for ${user.email} already hashed, skipping.`);
      }
    }

    console.log("All user passwords have been hashed.");
    process.exit();
  } catch (err) {
    console.error("Error hashing passwords:", err);
    process.exit(1);
  }
}

hashAllPlainPasswords();
