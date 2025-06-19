const axios = require("axios");

const baseUrl = "http://localhost:3001";

async function chatbot(message, userId = "TCI_EMP002", orgId = "TECHCORP_IN") {
  message = message.toLowerCase();

  try {
    // 💬 LEAVE BALANCE
    if (message.includes("leave") || message.includes("leaves")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const data = res.data;

      let reply = "📆 Your leave balance:\n";
      data.forEach(item => {
        reply += `• ${item.leave_type}: ${item.total_allotted - item.leaves_taken} remaining (${item.leaves_taken} taken)\n`;
      });

      return reply;
    }

    // 💬 HOLIDAY or POLICY
    if (message.includes("holiday") || message.includes("policy")) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const data = res.data;

      const relevant = data.find(p => message.includes(p.policy_category?.toLowerCase()) || message.includes(p.keywords?.toLowerCase()));
      if (relevant) {
        return `📋 *${relevant.policy_title}*:\n${relevant.policy_content}`;
      } else {
        return `🔍 No specific policy matched your query, but here are some keywords you can try: "WFH", "holiday", "travel"`;
      }
    }

    // 💬 SALARY or PAYROLL
    if (message.includes("salary") || message.includes("payroll") || message.includes("ctc")) {
      const res = await axios.get(`${baseUrl}/api/payroll/${userId}`);
      const data = res.data;

      return `💰 Your salary breakdown:\n• Base Salary: ₹${data.base_salary}\n• HRA: ₹${data.HRA}\n• CTC: ₹${data.ctc}`;
    }

    // 💬 WHO IS MY MANAGER?
if (message.includes("manager") || message.includes("report to")) {
    // Step 1: Get current user
    const res = await axios.get(`${baseUrl}/api/users/${userId}`);
    const user = res.data;

    if (!user.manager_id) {
      return "🤖 You don’t have a manager assigned.";
    }

    // Step 2: Get manager details
    const mgrRes = await axios.get(`${baseUrl}/api/users/${user.manager_id}`);
    const manager = mgrRes.data;

    return `🧑‍💼 Your manager is ${manager.first_name} ${manager.last_name}.`;
  }

  // 💬 DATE OF JOINING
  if (message.includes("date of joining") || message.includes("doj") || message.includes("when did i join")) {
    const res = await axios.get(`${baseUrl}/api/users/${userId}`);
    const user = res.data;

    const doj = new Date(user.date_of_joining);
    const formatted = doj.toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' });

    return `📅 You joined the company on ${formatted}.`;
  }


    // 💬 DEPARTMENT
    if (message.includes("department") || message.includes("team")) {
        const res = await axios.get(`${baseUrl}/api/users/${userId}`);
        const user = res.data;
  
        return `🏢 You work in the **${user.department}** department.`;
      }
  
          // 💬 LOCATION / OFFICE
    if (message.includes("location") || message.includes("office") || message.includes("work from")) {
        const res = await axios.get(`${baseUrl}/api/users/${userId}`);
        const user = res.data;
  
        return `📍 You are based in **${user.location}**.`;
      }
  
      
    return "🤖 I didn't understand that. You can ask about *leave balance*, *salary*, or *company policies*.";
  } catch (err) {
    console.error("Chatbot error:", err);
    return "⚠️ Something went wrong. Please try again.";
  }


  
}

module.exports = chatbot;
