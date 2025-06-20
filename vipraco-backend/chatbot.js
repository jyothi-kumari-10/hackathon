const axios = require("axios");
const baseUrl = "http://localhost:3001";

async function chatbot(message, userId = "TCI_EMP002", orgId = "TECHCORP_IN") {
  message = message.toLowerCase();
  let answer = null;

  try {
    // Fetch current user data
    const userRes = await axios.get(`${baseUrl}/api/users/${userId}`);
    const user = userRes.data;
    //NLP Training

    // Greeting based on current time (with multi-intent support)
    const greetingRegex = /(good morning|good afternoon|good evening|good night)/i;
    let greetingMatch = message.match(greetingRegex);
    let greetingResponse = null;
    if (greetingMatch) {
      const now = new Date();
      const hour = now.getHours();
      let greeting = "Hello";
      if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
      } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening";
      } else {
        greeting = "Good night";
      }
      greetingResponse = `${greeting}, ${user.first_name}!`;
      // Remove greeting from message for further processing
      message = message.replace(greetingRegex, "").trim();
    }

    if (message.includes("how are you")) {
      answer = "I am fine,Thank you. What about you?";
    }

    if (message.includes("I am fine")) {
      answer = "Glad to know!";
    }
    if (message.includes("Thank you")) {
      answer = "Im Glad that I could help!";
    }
    if (message.includes("What is your name")) {
      answer = "I am VipraBot";
    }

    if (message.includes("employee id")) {
      // 1. Employee ID
      answer = `Your employee ID is: ${user.user_id}`;
    }

    // 2. Designation
    if (message.includes("designation") || message.includes("role")) {
      answer = `Your current role is: ${user.role}`;
    }

    // 3. Manager (Self)
    if (message.includes("manager") && !message.includes("rahul")) {
      if (!user.manager_id) answer = "You don't have a manager assigned.";
      else {
        const mgrRes = await axios.get(`${baseUrl}/api/users/${user.manager_id}`);
        const mgr = mgrRes.data;
        answer = `Your manager is ${mgr.first_name} ${mgr.last_name}.`;
      }
    }

    // 4. Official Email
    if (message.includes("email")) {
      answer = `Your official email is: ${user.email}`;
    }

    // 5. Date of Joining
    if (
      message.includes("date of joining") ||
      message.includes("doj") ||
      message.includes("join")
    ) {
      const doj = new Date(user.date_of_joining);
      const formatted = doj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      answer = `You joined on ${formatted}.`;
    }

    // 6. Department
    if (message.includes("department")) {
      answer = `You work in the ${user.department} department.`;
    }

    // APPLY FOR LEAVE (Higher Priority)
    if (
      (message.includes("apply") || message.includes("request") || message.includes("want") || message.includes("need")) &&
      (message.includes("casual leave") || message.includes("sick leave") || message.includes("earned leave") || message.includes("annual leave") || message.includes("maternity leave") || message.includes("paternity leave"))
    ) {
      try {
        const applyRes = await axios.post(`${baseUrl}/api/leaves/apply`, {
          message: message,
          user_id: userId,
          organization_id: orgId
        });
        answer = applyRes.data.message; // Use the message from the apply leave response
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          answer = `Error: ${error.response.data.error}`;
        } else {
          answer = "Sorry, I encountered an error while applying for your leave. Please try again.";
          console.error("Error applying for leave:", error);
        }
      }
    }

    // 7. Casual Leave Balance
    if (message.includes("casual leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const casual = res.data.find(
        (l) => l.leave_type.toLowerCase() === "casual leave"
      );
      if (casual)
        answer = `You have ${
          casual.total_allotted - casual.leaves_taken
        } casual leaves left.`;
      else
        answer = "You have not taken any casual leaves.";
    }

    // 8. Earned Leave Balance
    if (message.includes("earned leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const earned = res.data.find(
        (l) => l.leave_type.toLowerCase() === "earned leave"
      );
      if (earned)
        answer = `Your earned leave balance is ${
          earned.total_allotted - earned.leaves_taken
        }.`;
      else
        answer = "You have not taken any earned leaves.";
    }

    // 9. Sick Leaves Taken
    if (message.includes("sick leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const sick = res.data.find(
        (l) => l.leave_type.toLowerCase() === "sick leave"
      );
      if (sick) {
        answer = `You have taken ${sick.leaves_taken} sick leaves.`;
      } else {
        answer = "You have not taken any sick leaves.";
      }
    }

    // 10. Pending Leave Approvals
    if (message.includes("pending approval")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const total = res.data.reduce(
        (sum, l) => sum + l.leaves_pending_approval,
        0
      );
      answer = `You have ${total} leave(s) pending approval.`;
    }

    // 11. Work From Home Policy
    if (message.includes("work from home")) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const match = res.data.find((p) =>
        p.policy_title.toLowerCase().includes("work from home")
      );
      if (match) answer = `${match.policy_title}:\n${match.policy_content}`;
    }

    // 12–15. General Policy Matching
    if (
      message.includes("policy") ||
      message.includes("holiday") ||
      message.includes("regulation") ||
      message.includes("attendance")
    ) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const data = res.data;

      // 12. Travel Policy
      if (message.includes("travel") || message.includes("expense")) {
        const travel = data.find((p) =>
          p.policy_title.toLowerCase().includes("travel")
        );
        if (travel) answer = `${travel.policy_title}:\n${travel.policy_content}`;
      }

      // 13. Next Company Holiday
      if (message.includes("next") && message.includes("holiday")) {
        const holiday = data.find((p) =>
          p.policy_title.toLowerCase().includes("holiday")
        );
        if (holiday)
          answer = `${holiday.policy_title}:\n${holiday.policy_content}`;
      }

      // 14. Safety Regulations
      if (
        message.includes("safety regulation") ||
        message.includes("safety policy")
      ) {
        const safety = data.find((p) =>
          p.policy_title.toLowerCase().includes("safety")
        );
        if (safety) answer = `${safety.policy_title}:\n${safety.policy_content}`;
      }

      // 15. Attendance Policy
      if (
        message.includes("attendance policy") ||
        message.includes("punctuality")
      ) {
        const attendance = data.find((p) =>
          p.policy_title.toLowerCase().includes("attendance")
        );
        if (attendance)
          answer = `${attendance.policy_title}:\n${attendance.policy_content}`;
      }

      // Fallback
      const relevant = data.find(
        (p) =>
          message.includes(p.policy_category?.toLowerCase()) ||
          message.includes(p.policy_title?.toLowerCase()) ||
          message.includes(p.keywords?.toLowerCase())
      );

      if (relevant) {
        answer = `${relevant.policy_title}:\n${relevant.policy_content}`;
      }

      answer = answer || `No exact policy matched. Try keywords like: WFH, attendance, holiday, safety, travel.`;
    }

    // 16–20. Payroll
    if (
      ["salary", "ctc", "pf", "hra", "tax", "payroll"].some((k) =>
        message.includes(k)
      )
    ) {
      const res = await axios.get(`${baseUrl}/api/payroll/${userId}`);
      const pay = res.data;
      if (!pay) answer = `No payroll record found for user ID: ${userId}`;
      else {
        if (message.includes("base salary"))
          answer = `Your base salary is ₹${pay.base_salary}`;
        if (message.includes("ctc")) answer = `Your total CTC is ₹${pay.ctc}`;
        if (message.includes("pf"))
          answer = `Your PF deduction is ₹${pay.pf_deduction}`;
        if (message.includes("hra")) answer = `Your HRA is ₹${pay.HRA}`;
        if (message.includes("tax"))
          answer = `Professional tax deducted is ₹${pay.professional_tax}`;
        console.log("Got payroll data for:", userId, pay);
        answer = `Payroll summary:\n• Base Salary: ₹${pay.base_salary}\n• HRA: ₹${pay.HRA}\n• CTC: ₹${pay.ctc}`;
      }
    }

    // 21. Rahul Verma's Manager
    if (message.includes("rahul verma")) {
      const empRes = await axios.get(`${baseUrl}/api/users`);
      const rahul = empRes.data.find(
        (u) =>
          u.first_name.toLowerCase() === "rahul" &&
          u.last_name.toLowerCase() === "verma"
      );

      if (rahul?.manager_id) {
        const mgr = await axios.get(`${baseUrl}/api/users/${rahul.manager_id}`);
        answer = `Rahul Verma's manager is ${mgr.data.first_name} ${mgr.data.last_name}`;
      }

      answer = answer || `Rahul Verma's manager not found.`;
    }

    // 22. TechCorp Policies
    if (message.includes("techcorp")) {
      const res = await axios.get(`${baseUrl}/api/policies/TECHCORP_IN`);
      answer = (
        res.data.map((p) => `• ${p.policy_title}`).join("\n") ||
        `No policies found.`
      );
    }

    // 23. Holidays for UP/Bihar in 2025
    if (
      message.includes("up") ||
      message.includes("bihar") ||
      message.includes("2025")
    ) {
      const res = await axios.get(`${baseUrl}/api/policies/MGFAB_GLOBAL`);
      const match = res.data.find(
        (p) =>
          p.policy_title.toLowerCase().includes("holiday") ||
          p.policy_title.toLowerCase().includes("bihar") ||
          p.policy_title.toLowerCase().includes("2025")
      );

      if (match) answer = `${match.policy_title}:\n${match.policy_content}`;
    }
    if (
      message.includes("hi") ||
      message.includes("hey") ||
      message.includes("hello")
    ) {
      answer = `Hello ${user.first_name}! How can I help you?`;
    }
    
    if (greetingResponse && (!message || message === '' || message === ',')) {
      // Only greeting, no other question
      return `${greetingResponse} How can I help you?`;
    }
    if (answer) {
      // There is a real answer, prepend greeting if present
      return greetingResponse ? `${greetingResponse} ${answer}` : answer;
    }
    // If nothing matched, fallback
    if (greetingResponse) {
      return `${greetingResponse} I didn't understand that. You can ask about leave, salary, manager, or company policies.`;
    }
    return "I didn't understand that. You can ask about leave, salary, manager, or company policies.";
  } catch (err) {
    console.error(
      "Chatbot error (detailed):",
      err.response?.data || err.message
    );
    return "Something went wrong. Please try again.";
  }
}

module.exports = chatbot;