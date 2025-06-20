import React from "react";

export default function ProfilePopup({ profileData, onClose }) {
  if (!profileData) return null;

  const labelStyle = { fontWeight: "bold", marginRight: 5 };
  const rowStyle = { marginBottom: 10 };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        background: "white",
        position: "relative"
      }}
    >
      
      <h3 style={{color : "#0000FF"}}>Employee Profile</h3>
      <div style={rowStyle}><span style={labelStyle}>Name:</span>{profileData.first_name} {profileData.last_name}</div>
      <div style={rowStyle}><span style={labelStyle}>Email:</span>{profileData.email}</div>
      <div style={rowStyle}><span style={labelStyle}>Role:</span>{profileData.role}</div>
      <div style={rowStyle}><span style={labelStyle}>Department:</span>{profileData.department}</div>
      <div style={rowStyle}><span style={labelStyle}>Location:</span>{profileData.location}</div>
      <div style={rowStyle}><span style={labelStyle}>Date of Joining:</span>{new Date(profileData.date_of_joining).toLocaleDateString()}</div>
    </div>
  );
}
