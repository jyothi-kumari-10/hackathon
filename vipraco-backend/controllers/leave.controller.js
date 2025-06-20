const db = require("../models");
const nlp = require("compromise");
const chrono = require("chrono-node");
const nodemailer = require("nodemailer");
require('dotenv').config();


// Helper: extract leave type and dates
function extractLeaveEntities(message) {
  // Extract leave type (e.g., vacation, sick, casual, earned)
  const leaveTypeMatch = message.match(/(vacation|sick|casual|earned|annual|maternity|paternity) leave/i);
  const leave_type = leaveTypeMatch ? leaveTypeMatch[1].toLowerCase() : null;


  // Extract dates using chrono-node
  const dateResults = chrono.parse(message);
  let start_date = null, end_date = null;
  if (dateResults.length > 0) {
    start_date = dateResults[0].start ? dateResults[0].start.date() : null;
    end_date = dateResults[0].end ? dateResults[0].end.date() : null;


    // Handle phrases like "for 3 days" if chrono doesn't find an end date
    if (start_date && !end_date) {
      const durationMatch = message.match(/for (?:the next )?(\d+) days/i);
      if (durationMatch) {
        const numberOfDays = parseInt(durationMatch[1], 10);
        if (numberOfDays > 0) {
          end_date = new Date(start_date);
          end_date.setDate(end_date.getDate() + numberOfDays - 1);
        }
      }
    }


    // If still no end date, default it to the start date
    if (start_date && !end_date) {
      end_date = start_date;
    }
  }
  return { leave_type, start_date, end_date };
}


exports.applyLeave = async (req, res) => {
  const { message, user_id, organization_id } = req.body;
  if (!message || !user_id || !organization_id) {
    return res.status(400).json({ error: "Missing required fields." });
  }


  // 1. Extract entities
  const { leave_type, start_date, end_date } = extractLeaveEntities(message);
  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({ error: "Could not extract leave type or dates from your message." });
  }


  try {
    // 2. Check leave balance
    const balance = await db.LeaveBalances.findOne({
      where: { user_id, organization_id, leave_type: leave_type + " leave" }
    });
    if (!balance) {
      return res.status(400).json({ error: `No leave balance found for type: ${leave_type}` });
    }
    // Calculate days requested
    const daysRequested = Math.ceil((end_date - start_date) / (1000 * 60 * 60 * 24)) + 1;
    const available = balance.total_allotted - balance.leaves_taken - balance.leaves_pending_approval;
    if (daysRequested > available) {
      return res.status(400).json({ error: `Insufficient leave balance. You have ${available} days left.` });
    }


    // 3. Create leave request
    const leaveRequest = await db.LeaveRequests.create({
      organization_id,
      user_id,
      leave_type: leave_type + " leave",
      start_date,
      end_date,
      status: "Pending"
    });


    // 4. Update pending approval
    balance.leaves_pending_approval += daysRequested;
    await balance.save();


    // 5. Notify manager (email)
    const user = await db.Users.findOne({ where: { user_id, organization_id } });
    let managerEmail = null;
    if (user && user.manager_id) {
      const manager = await db.Users.findOne({ where: { user_id: user.manager_id, organization_id } });
      managerEmail = manager ? manager.email : null;
    }
    if (managerEmail) {
      // Configure nodemailer
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address from .env file
          pass: process.env.EMAIL_PASS  // Your Gmail password or App Password from .env file
        }
      });
      await transporter.sendMail({
        from: 'noreply@company.com',
        to: managerEmail,
        subject: `Leave Request from ${user.first_name} ${user.last_name}`,
        text: `${user.first_name} ${user.last_name} has applied for ${leave_type} leave from ${start_date.toDateString()} to ${end_date.toDateString()} (${daysRequested} days). Please review in the HR portal.`
      });
    }


    // 6. Respond
    return res.json({
      message: `Leave request for ${leave_type} leave from ${start_date.toDateString()} to ${end_date.toDateString()} (${daysRequested} days) submitted successfully. Your manager has been notified.`
    });
  } catch (err) {
    console.error("Error in applyLeave:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
