# VipraCo Chatbot – Hack-The-Work 2025

**Overview**

VipraCo is a full-stack HR chatbot developed during Hack-The-Work 2025 Hackathon, organized by B.M.S. College of Engineering in collaboration with Vipra Software Pvt. Ltd.

The chatbot automates employee services such as leave applications, payroll queries, and company policy assistance.

Our solution secured 2nd Prize at the event.


**Technology Stack**

Frontend: React (19.1), Vite (6.3.5), TailwindCSS, Axios

Backend: Node.js (22.14), Express (5.1), Sequelize (6.37), MySQL2, CORS, Nodemailer

NLP & Processing: Fuse.js, Compromise, Chrono-node

Database Models: Users, Organizations, LeaveRequests, PayrollData, CompanyPolicies, Admin


**Deployment Guide**
**Prerequisites**

Node.js (v16 or higher)

MySQL Database

npm or yarn package manager


**Database Setup**

Create a MySQL database.

In the vipraco-backend/ directory, create a **.env file**:

DB_HOST=localhost  
DB_USER=your_username  
DB_PASSWORD=your_password  
DB_NAME=vipraco_db  
DB_DIALECT=mysql  
PORT=3001  


**Backend Setup (Port: 3001)**

cd vipraco-backend

npm install

npm start


**Frontend Setup (Port: 5173)**

cd vipraco-frontend

npm install

npm run dev


**Production Build**

**Frontend**
cd vipraco-frontend

npm run build


**Backend**
cd vipraco-backend

npm start


**Access URLs**

Frontend → http://localhost:5173

Backend API → http://localhost:3001

API Endpoints → http://localhost:3001/api/*


**Achievement**

Built in under 48 hours during Hack-The-Work 2025 Hackathon

Won 2nd Prize among competing teams
