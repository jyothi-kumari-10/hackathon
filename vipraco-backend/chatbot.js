const axios = require("axios");
const Fuse = require('fuse.js');
const baseUrl = "http://localhost:3001";


// --- Start of Spelling Correction Setup ---


// 1. Define the dictionary of correct keywords your bot understands.
const keywordDictionary = [
  'apply', 'request', 'leave', 'casual', 'sick', 'earned', 'annual', 'maternity', 'paternity',
  'manager', 'email', 'role', 'designation', 'policy', 'holiday', 'salary', 'payroll',
  'pending', 'approval', 'joining', 'department', 'wfh', 'work', 'from', 'home',
  'morning', 'afternoon', 'evening', 'night'
];


// 2. Configure Fuse.js for fuzzy matching.
const fuse = new Fuse(keywordDictionary, {
  includeScore: true,
  threshold: 0.4 // This tunes the strictness. 0=exact, 1=anything. 0.4 is a good starting point.
});


// 3. Create the function that corrects the message.
function correctMessage(message) {
  const words = message.split(' ');
  const correctedWords = words.map(word => {
    const results = fuse.search(word);
    // If we find a close match, replace the misspelled word with the correct one.
    if (results.length > 0 && results[0].score < fuse.options.threshold) {
      return results[0].item;
    }
    return word; // Otherwise, keep the original word.
  });
  return correctedWords.join(' ');
}


// --- End of Spelling Correction Setup ---


async function chatbot(message, userId = "TCI_EMP002", orgId = "TECHCORP_IN") {
  // First, run the spelling correction on the incoming message.
  const correctedMessage = correctMessage(message.toLowerCase());
  let answer = null;


  try {
    // Fetch current user data
    const userRes = await axios.get(`${baseUrl}/api/users/${userId}`);
    const user = userRes.data;


    // INTENT-BASED LOGIC (if/else if)
   
    // 1. APPLY FOR LEAVE (Highest Priority)
    const applyIntent = correctedMessage.includes("apply") || correctedMessage.includes("request") || correctedMessage.includes("want") || correctedMessage.includes("need");
    const leaveIntent = correctedMessage.includes("leave");


    if (applyIntent && leaveIntent) {
        try {
            const applyRes = await axios.post(`${baseUrl}/api/leaves/apply`, {
                message: correctedMessage,
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
   
    // Greeting based on current time (with multi-intent support)
    else if (correctedMessage.match(/(good morning|good afternoon|good evening|good night)/i)) {
      const greetingRegex = /(good morning|good afternoon|good evening|good night)/i;
      let greetingMatch = correctedMessage.match(greetingRegex);
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
        answer = `${greeting}, ${user.first_name}!`;
      }
    }


    else if (correctedMessage.includes("how are you")) {
      answer = "I am fine,Thank you. What about you?";
    }


    else if (correctedMessage.includes("I am fine")) {
      answer = "Glad to know!";
    }
    else if (correctedMessage.includes("Thank you")) {
      answer = "Im Glad that I could help!";
    }
    else if (correctedMessage.includes("What is your name")) {
      answer = "I am VipraBot";
    }


    else if (correctedMessage.includes("employee id")) {
      // 1. Employee ID
      answer = `Your employee ID is: ${user.user_id}`;
    }


    // 2. Designation
    else if (correctedMessage.includes("designation") || correctedMessage.includes("role")) {
      answer = `Your current role is: ${user.role}`;
    }


    // 3. Manager (Self)
    else if (correctedMessage.includes("manager") && !correctedMessage.includes("rahul")) {
      if (!user.manager_id) answer = "You don't have a manager assigned.";
      else {
        const mgrRes = await axios.get(`${baseUrl}/api/users/${user.manager_id}`);
        const mgr = mgrRes.data;
        answer = `Your manager is ${mgr.first_name} ${mgr.last_name}.`;
      }
    }


    // 4. Official Email
    else if (correctedMessage.includes("email")) {
      answer = `Your official email is: ${user.email}`;
    }


    // 5. Date of Joining
    else if (
      correctedMessage.includes("date of joining") ||
      correctedMessage.includes("doj") ||
      correctedMessage.includes("join")
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
    else if (correctedMessage.includes("department")) {
      answer = `You work in the ${user.department} department.`;
    }


    // 7. Casual Leave Balance
    else if (correctedMessage.includes("casual leave")) {
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
    else if (correctedMessage.includes("earned leave")) {
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
    else if (correctedMessage.includes("sick leave")) {
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
    else if (correctedMessage.includes("pending approval")) {
      const res = await axios.get(`${baseUrl}/api/leaves/${userId}`);
      const total = res.data.reduce(
        (sum, l) => sum + l.leaves_pending_approval,
        0
      );
      answer = `You have ${total} leave(s) pending approval.`;
    }


    // 11. Work From Home Policy
    else if (correctedMessage.includes("work from home")) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const match = res.data.find((p) =>
        p.policy_title.toLowerCase().includes("work from home")
      );
      if (match) answer = `${match.policy_title}:\n${match.policy_content}`;
    }


    // 12–15. General Policy Matching
    else if (
      correctedMessage.includes("policy") ||
      correctedMessage.includes("holiday") ||
      correctedMessage.includes("regulation") ||
      correctedMessage.includes("attendance")
    ) {
      const res = await axios.get(`${baseUrl}/api/policies/${orgId}`);
      const data = res.data;


      // 12. Travel Policy
      if (correctedMessage.includes("travel") || correctedMessage.includes("expense")) {
        const travel = data.find((p) =>
          p.policy_title.toLowerCase().includes("travel")
        );
        if (travel) answer = `${travel.policy_title}:\n${travel.policy_content}`;
      }


      // 13. Next Company Holiday
      else if (correctedMessage.includes("next") && correctedMessage.includes("holiday")) {
        const holiday = data.find((p) =>
          p.policy_title.toLowerCase().includes("holiday")
        );
        if (holiday)
          answer = `${holiday.policy_title}:\n${holiday.policy_content}`;
      }


      // 14. Safety Regulations
      else if (
        correctedMessage.includes("safety regulation") ||
        correctedMessage.includes("safety policy")
      ) {
        const safety = data.find((p) =>
          p.policy_title.toLowerCase().includes("safety")
        );
        if (safety) answer = `${safety.policy_title}:\n${safety.policy_content}`;
      }


      // 15. Attendance Policy
      else if (
        correctedMessage.includes("attendance policy") ||
        correctedMessage.includes("punctuality")
      ) {
        const attendance = data.find((p) =>
          p.policy_title.toLowerCase().includes("attendance")
        );
        if (attendance)
          answer = `${attendance.policy_title}:\n${attendance.policy_content}`;
      }


      // Fallback
      else {
          const relevant = data.find(
            (p) =>
              correctedMessage.includes(p.policy_category?.toLowerCase()) ||
              correctedMessage.includes(p.policy_title?.toLowerCase()) ||
              correctedMessage.includes(p.keywords?.toLowerCase())
          );


          if (relevant) {
            answer = `${relevant.policy_title}:\n${relevant.policy_content}`;
          }


          answer = answer || `No exact policy matched. Try keywords like: WFH, attendance, holiday, safety, travel.`;
      }
    }


    // 16–20. Payroll
    else if (
      ["salary", "ctc", "pf", "hra", "tax", "payroll"].some((k) =>
        correctedMessage.includes(k)
      )
    ) {
      const res = await axios.get(`${baseUrl}/api/payroll/${userId}`);
      const pay = res.data;
      if (!pay) answer = `No payroll record found for user ID: ${userId}`;
      else {
        if (correctedMessage.includes("base salary"))
          answer = `Your base salary is ₹${pay.base_salary}`;
        if (correctedMessage.includes("ctc")) answer = `Your total CTC is ₹${pay.ctc}`;
        if (correctedMessage.includes("pf"))
          answer = `Your PF deduction is ₹${pay.pf_deduction}`;
        if (correctedMessage.includes("hra")) answer = `Your HRA is ₹${pay.HRA}`;
        if (correctedMessage.includes("tax"))
          answer = `Professional tax deducted is ₹${pay.professional_tax}`;
        console.log("Got payroll data for:", userId, pay);
        answer = `Payroll summary:\n• Base Salary: ₹${pay.base_salary}\n• HRA: ₹${pay.HRA}\n• CTC: ₹${pay.ctc}`;
      }
    }


    // 21. Rahul Verma's Manager
    else if (correctedMessage.includes("rahul verma")) {
      const empRes = await axios.get(`${baseUrl}/api/users`);
      const rahul = empRes.data.find(
        (u) =>
          u.first_name.toLowerCase() === "rahul" &&
          u.last_name.toLowerCase() === "verma"
      );


      if (rahul?.manager_id) {
        const mgrRes = await axios.get(`${baseUrl}/api/users/${rahul.manager_id}`);
        answer = `Rahul Verma's manager is ${mgrRes.data.first_name} ${mgrRes.data.last_name}`;
      }


      answer = answer || `Rahul Verma's manager not found.`;
    }


    // 22. TechCorp Policies
    else if (correctedMessage.includes("techcorp")) {
      const res = await axios.get(`${baseUrl}/api/policies/TECHCORP_IN`);
      answer = (
        res.data.map((p) => `• ${p.policy_title}`).join("\n") ||
        `No policies found.`
      );
    }


    // 23. Holidays for UP/Bihar in 2025
    else if (
      correctedMessage.includes("up") ||
      correctedMessage.includes("bihar") ||
      correctedMessage.includes("2025")
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
      correctedMessage.includes("hi") ||
      correctedMessage.includes("hey") ||
      correctedMessage.includes("hello")
    ) {
      answer = `Hello ${user.first_name}! How can I help you?`;
    }
   
    if (answer) {
      // There is a real answer, prepend greeting if present
      return answer;
    }
    // If nothing matched, fallback
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
