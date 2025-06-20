const axios = require("axios");
const baseUrl = "http://localhost:3001";

async function chatbot(message, userId = "TCI_EMP002", orgId = "TECHCORP_IN") {
  message = message.toLowerCase();

  try {
    // Fetch current user data
    const userRes = await axios.get(`${baseUrl}/api/users/${userId}`);
    const user = userRes.data;
    //NLP Training

    if (message.includes("how are you")) {
      return `I am fine,Thank you. What about you?`;
    }

    if (message.includes("I am fine")) {
      return `Glad to know!`;
    }
    if (message.includes("Thank you")) {
      return `Im Glad that I could help!`;
    }
    if (message.includes("What is your name")) {
      return `I am VipraBot`;
    }

    if (message.includes("employee id")) {
      // 1. Employee ID
      return `Your employee ID is: ${user.user_id}`;
    }

    // 2. Designation
    if (message.includes("designation") || message.includes("role")) {
      return `Your current role is: ${user.role}`;
    }

    // 3. Manager (Self)
    if (message.includes("manager") && !message.includes("rahul")) {
      if (!user.manager_id) return "You don’t have a manager assigned.";
      const mgrRes = await axios.get(`${baseUrl}/api/users/${user.manager_id}`);
      const mgr = mgrRes.data;
      return `Your manager is ${mgr.first_name} ${mgr.last_name}.`;
    }

    // 4. Official Email
    if (message.includes("email")) {
      return `Your official email is: ${user.email}`;
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
      return `You joined on ${formatted}.`;
    }

    // 6. Department
    if (message.includes("department")) {
      return `You work in the ${user.department} department.`;
    }

    // 7. Casual Leave Balance
    if (message.includes("casual leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const casual = res.data.find(
        (l) => l.leave_type.toLowerCase() === "casual leave"
      );
      if (casual)
        return `You have ${
          casual.total_allotted - casual.leaves_taken
        } casual leaves left.`;
    }

    // 8. Earned Leave Balance
    if (message.includes("earned leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const earned = res.data.find(
        (l) => l.leave_type.toLowerCase() === "earned leave"
      );
      if (earned)
        return `Your earned leave balance is ${
          earned.total_allotted - earned.leaves_taken
        }.`;
    }

    // 9. Sick Leaves Taken
    if (message.includes("sick leave")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const sick = res.data.find(
        (l) => l.leave_type.toLowerCase() === "sick leave"
      );
      if (sick) return `You have taken ${sick.leaves_taken} sick leaves.`;
    }

    // 10. Pending Leave Approvals
    if (message.includes("pending approval")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const total = res.data.reduce(
        (sum, l) => sum + l.leaves_pending_approval,
        0
      );
      return `You have ${total} leave(s) pending approval.`;
    }

    // 11. Work From Home Policy
    if (message.includes("work from home")) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const match = res.data.find((p) =>
        p.policy_title.toLowerCase().includes("work from home")
      );
      if (match) return `${match.policy_title}:\n${match.policy_content}`;
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
        if (travel) return `${travel.policy_title}:\n${travel.policy_content}`;
      }

      // 13. Next Company Holiday
      if (message.includes("next") && message.includes("holiday")) {
        const holiday = data.find((p) =>
          p.policy_title.toLowerCase().includes("holiday")
        );
        if (holiday)
          return `${holiday.policy_title}:\n${holiday.policy_content}`;
      }

      // 14. Safety Regulations
      if (
        message.includes("safety regulation") ||
        message.includes("safety policy")
      ) {
        const safety = data.find((p) =>
          p.policy_title.toLowerCase().includes("safety")
        );
        if (safety) return `${safety.policy_title}:\n${safety.policy_content}`;
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
          return `${attendance.policy_title}:\n${attendance.policy_content}`;
      }

      // Fallback
      const relevant = data.find(
        (p) =>
          message.includes(p.policy_category?.toLowerCase()) ||
          message.includes(p.policy_title?.toLowerCase()) ||
          message.includes(p.keywords?.toLowerCase())
      );

      if (relevant) {
        return `${relevant.policy_title}:\n${relevant.policy_content}`;
      }

      return `No exact policy matched. Try keywords like: WFH, attendance, holiday, safety, travel.`;
    }

    // 16–20. Payroll
    if (
      ["salary", "ctc", "pf", "hra", "tax", "payroll"].some((k) =>
        message.includes(k)
      )
    ) {
      const res = await axios.get(`${baseUrl}/api/payroll/${userId}`);
      const pay = res.data;
      if (!pay) return `No payroll record found for user ID: ${userId}`;

      if (message.includes("base salary"))
        return `Your base salary is ₹${pay.base_salary}`;
      if (message.includes("ctc")) return `Your total CTC is ₹${pay.ctc}`;
      if (message.includes("pf"))
        return `Your PF deduction is ₹${pay.pf_deduction}`;
      if (message.includes("hra")) return `Your HRA is ₹${pay.HRA}`;
      if (message.includes("tax"))
        return `Professional tax deducted is ₹${pay.professional_tax}`;
      console.log("Got payroll data for:", userId, pay);
      return `Payroll summary:\n• Base Salary: ₹${pay.base_salary}\n• HRA: ₹${pay.HRA}\n• CTC: ₹${pay.ctc}`;
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
        return `Rahul Verma's manager is ${mgr.data.first_name} ${mgr.data.last_name}`;
      }

      return `Rahul Verma's manager not found.`;
    }

    // 22. TechCorp Policies
    if (message.includes("techcorp")) {
      const res = await axios.get(`${baseUrl}/api/policies/TECHCORP_IN`);
      return (
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

      if (match) return `${match.policy_title}:\n${match.policy_content}`;
    }
    if (
      message.includes("hi") ||
      message.includes("hey") ||
      message.includes("hello")
    ) {
      return `Hello ${user.first_name}! How can I help you?`;
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