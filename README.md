
VipraCo Deployment Guide
------------------------

Prerequisites
- Node.js (v16 or higher)
- MySQL Database
- npm or yarn package manager

Database Setup
1. Create a MySQL database.
2. In the `vipraco-backend/` directory, create a `.env` file with the following content:

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=vipraco_db
DB_DIALECT=mysql
PORT=3001

Backend Setup (Port: 3001)
cd vipraco-backend
npm install
npm start

Frontend Setup (Port: 5173)
cd vipraco-frontend
npm install
npm run dev

Production Build
To build and run the application for production:

# Frontend
cd vipraco-frontend
npm run build

# Backend
cd vipraco-backend
npm start

Access URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Endpoints: http://localhost:3001/api/*

Key Dependencies
Backend:
- Express
- Sequelize
- MySQL2
- CORS
- Nodemailer

Frontend:
- React
- Vite
- Axios
- TailwindCSS

Database Models
- Users
- Organizations
- LeaveRequests
- PayrollData
- CompanyPolicies
- Admin
