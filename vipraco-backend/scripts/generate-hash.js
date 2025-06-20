const bcrypt = require("bcrypt");
const readline = require("readline");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


rl.question("Enter the password to hash: ", async (password) => {
  if (!password) {
    console.error("Password cannot be empty.");
    rl.close();
    return;
  }


  try {
    const hash = await bcrypt.hash(password, 10);
    console.log("Generated hash:", hash);
  } catch (err) {
    console.error("Error generating hash:", err);
  } finally {
    rl.close();
  }
});
