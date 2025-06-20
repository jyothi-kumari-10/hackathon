import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const subscriptionOptions = [
  { value: "Basic", label: "Basic" },
  { value: "Enterprise", label: "Enterprise" },
  { value: "Standard", label: "Standard" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgPlan, setOrgPlan] = useState("");
  const [orgIdToRemove, setOrgIdToRemove] = useState("");
  const [empData, setEmpData] = useState({ user_id: "", organization_id: "", first_name: "", last_name: "", email: "", password: "", role: "", manager_id: "", date_of_joining: "", department: "", location: "" });
  const [empIdToRemove, setEmpIdToRemove] = useState("");
  const [message, setMessage] = useState("");

  // Logout function
  const handleLogout = () => {
    // Clear any admin session data if needed
    localStorage.removeItem('adminToken'); // If you're using token-based auth
    navigate('/'); // Navigate back to login selection
  };

  // Add Organization
  const handleAddOrg = async () => {
    try {
      await axios.post("http://localhost:3001/api/admin/organization", { organization_id: orgId, org_name: orgName, subscription_plan: orgPlan });
      setMessage("Organization added!");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      setMessage("Failed to add organization");
    }
  };

  // Remove Organization
  const handleRemoveOrg = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/organization/${orgIdToRemove}`);
      setMessage("Organization removed!");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      setMessage("Failed to remove organization");
    }
  };

  // Add Employee
  const handleAddEmp = async () => {
    try {
      await axios.post("http://localhost:3001/api/admin/employee", empData);
      setMessage("Employee added!");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      setMessage("Failed to add employee");
    }
  };

  // Remove Employee
  const handleRemoveEmp = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/employee/${empIdToRemove}`);
      setMessage("Employee removed!");
      
    } catch {
      setMessage("Failed to remove employee");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", padding: "40px 0" }}>
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 32, border: "none", borderRadius: 16, background: "#fff", boxShadow: "0 2px 16px #0001" }}>
        {/* Header with logout button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 32, color: "#1a237e", margin: 0 }}>Admin Dashboard</h2>
          <button 
            onClick={handleLogout}
            style={{ 
              background: "#8B0000", 
              color: "#fff", 
              border: "none", 
              borderRadius: 6, 
              padding: "8px 16px", 
              fontWeight: 600, 
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Logout
          </button>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, color: "#1a237e" }}>Add Organization</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input placeholder="Organization ID" value={orgId} onChange={e => setOrgId(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} style={{ flex: 2, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <select value={orgPlan} onChange={e => setOrgPlan(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }}>
              <option value="">Select Plan</option>
              {subscriptionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <button onClick={handleAddOrg} style={{ background: "#1a237e", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>Add</button>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, color: "#1a237e" }}>Remove Organization</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input placeholder="Organization ID" value={orgIdToRemove} onChange={e => setOrgIdToRemove(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <button onClick={handleRemoveOrg} style={{ background: "#ff0000", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>Remove</button>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, color: "#1a237e" }}>Add Employee</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <input placeholder="Employee ID" value={empData.user_id} onChange={e => setEmpData({ ...empData, user_id: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Organization ID" value={empData.organization_id} onChange={e => setEmpData({ ...empData, organization_id: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="First Name" value={empData.first_name} onChange={e => setEmpData({ ...empData, first_name: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Last Name" value={empData.last_name} onChange={e => setEmpData({ ...empData, last_name: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Email" value={empData.email} onChange={e => setEmpData({ ...empData, email: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input type="password" placeholder="Password" value={empData.password} onChange={e => setEmpData({ ...empData, password: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Role" value={empData.role} onChange={e => setEmpData({ ...empData, role: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Manager ID" value={empData.manager_id} onChange={e => setEmpData({ ...empData, manager_id: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input type="date" placeholder="Date of Joining (YYYY-MM-DD)" value={empData.date_of_joining} onChange={e => setEmpData({ ...empData, date_of_joining: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Department" value={empData.department} onChange={e => setEmpData({ ...empData, department: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <input placeholder="Location" value={empData.location} onChange={e => setEmpData({ ...empData, location: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <button onClick={handleAddEmp} style={{ background: "#1a237e", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>Add</button>
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, color: "#1a237e" }}>Remove Employee</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input placeholder="Employee User ID" value={empIdToRemove} onChange={e => setEmpIdToRemove(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
            <button onClick={handleRemoveEmp} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>Remove</button>
          </div>
        </div>
        {message && <div style={{ color: message.includes("Failed") ? "#e53935" : "#388e3c", textAlign: "center", fontWeight: 600, fontSize: 16 }}>{message}</div>}
      </div>
    </div>
  );
} 