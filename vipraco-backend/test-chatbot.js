const chatbot = require("./chatbot");

async function run() {
  const input = "Where do I work from?";
  const reply = await chatbot(input);
  console.log("💬 Bot:", reply);
}

run();
