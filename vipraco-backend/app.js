const express = require("express");
const cors = require("cors");
const db = require("./models"); // automatically loads index.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const organizationRoutes = require("./routes/organization.routes");
app.use("/api/organizations", organizationRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

const leaveRoutes = require("./routes/leave.routes");
app.use("/api/leaves", leaveRoutes);

const policyRoutes = require("./routes/policy.routes");
app.use("/api/policies", policyRoutes);

const payrollRoutes = require("./routes/payroll.routes");
app.use("/api/payroll", payrollRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

/*app.get("/", (req, res) => {
    res.send("✅ VipraCo Backend is running!");
  });
  */
  
// ✅ Test DB connection and sync models
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    return db.sequelize.sync(); // Creates tables if they don't exist
  })
  .then(() => {
    console.log("✅ Tables synchronized successfully.");
    // Optional: Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

  const chatbot = require("./chatbot");

app.post("/api/chat", async (req, res) => {
  const { message, userId, orgId } = req.body;

  if (!userId || !orgId) {
    return res.status(400).json({ reply: "Missing userId or orgId." });
  }

  const reply = await chatbot(message, userId, orgId);
  res.json({ reply });
});

