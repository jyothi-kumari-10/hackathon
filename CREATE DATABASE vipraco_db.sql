CREATE DATABASE vipraco_db;
USE vipraco_db;
CREATE TABLE Organizations (
	organization_id VARCHAR(50) PRIMARY KEY,
	org_name VARCHAR(255) NOT NULL,
	subscription_plan VARCHAR(50),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE Users (
	user_id VARCHAR(50) PRIMARY KEY,
	organization_id VARCHAR(50) NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role VARCHAR(100) NOT NULL, -- e.g., 'Employee', 'Manager', 'Admin'
	manager_id VARCHAR(50), 	-- Can be NULL
	date_of_joining DATE NOT NULL,
	department VARCHAR(100),
	location VARCHAR(100),
	FOREIGN KEY (organization_id) REFERENCES Organizations(organization_id),
	FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);
 
CREATE TABLE LeaveBalances (
	balance_id INT AUTO_INCREMENT PRIMARY KEY,
	organization_id VARCHAR(50) NOT NULL,
	user_id VARCHAR(50) NOT NULL,
	leave_type VARCHAR(50) NOT NULL, -- 'Casual Leave', etc.
	total_allotted INT NOT NULL,
	leaves_taken INT DEFAULT 0,
    leaves_pending_approval INT DEFAULT 0,
	last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (organization_id) REFERENCES Organizations(organization_id),
	FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
 
CREATE TABLE CompanyPolicies (
	policy_id INT AUTO_INCREMENT PRIMARY KEY,
	organization_id VARCHAR(50) NOT NULL,
	policy_title VARCHAR(255) NOT NULL,
	policy_category VARCHAR(100),
	policy_content TEXT NOT NULL,
	last_reviewed DATE,
	keywords TEXT,
	FOREIGN KEY (organization_id) REFERENCES Organizations(organization_id)
);
 
CREATE TABLE PayrollData (
	payroll_id INT AUTO_INCREMENT PRIMARY KEY,
	organization_id VARCHAR(50) NOT NULL,
	user_id VARCHAR(50) NOT NULL,
	base_salary DECIMAL(10, 2) NOT NULL,
	HRA DECIMAL(10, 2),
    conveyance_allowance DECIMAL(10, 2),
	medical_allowance DECIMAL(10, 2),
	pf_deduction DECIMAL(10, 2),
	esi_deduction DECIMAL(10, 2),
	professional_tax DECIMAL(10, 2),
	ctc DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES Organizations(organization_id),
	FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO Organizations (organization_id, org_name, subscription_plan) VALUES
('TECHCORP_IN', 'TechCorp Innovations Pvt. Ltd.', 'Basic'),
('MGFAB_GLOBAL', 'Muzaffarpur Global Fabricators', 'Standard'),
('EDU_INST', 'BMS Education Institute', 'Enterprise');
 
INSERT INTO Users (user_id, organization_id, first_name,
last_name, email, password_hash, role, manager_id,
date_of_joining, department, location) VALUES
('TCI_MGR001', 'TECHCORP_IN', 'Ananya', 'Sharma',
'ananya.sharma@techcorp.com', 'hashed_pass_ananya', 'Manager',
NULL, '2020-01-15', 'Engineering', 'Bangalore'),
('TCI_EMP002', 'TECHCORP_IN', 'Rahul', 'Verma',
'rahul.verma@techcorp.com', 'hashed_pass_rahul', 'Employee',
'TCI_MGR001', '2021-03-10', 'Engineering', 'Bangalore'),
('TCI_HR003', 'TECHCORP_IN', 'Priya', 'Singh',
'priya.singh@techcorp.com', 'hashed_pass_priya', 'Admin', NULL,
'2019-07-20', 'Human Resources', 'Bangalore'),
('TCI_EMP004', 'TECHCORP_IN', 'Amit', 'Kumar',
'amit.kumar@techcorp.com', 'hashed_pass_amit', 'Employee',
'TCI_MGR001', '2022-06-01', 'Engineering', 'Bangalore');
 
INSERT INTO Users (user_id, organization_id, first_name,
last_name, email, password_hash, role, manager_id,
date_of_joining, department, location) VALUES
('MGF_MGR001', 'MGFAB_GLOBAL', 'Suresh', 'Kumar',
'suresh.kumar@mgfab.com', 'hashed_pass_suresh', 'Manager', NULL,
'2018-05-01', 'Production', 'Muzaffarpur, UP'),
('MGF_EMP002', 'MGFAB_GLOBAL', 'Geeta', 'Devi',
'geeta.devi@mgfab.com', 'hashed_pass_geeta', 'Employee',
'MGF_MGR001', '2022-09-01', 'Quality Control', 'Muzaffarpur,
UP');
 
INSERT INTO LeaveBalances (organization_id, user_id, leave_type,
total_allotted, leaves_taken, leaves_pending_approval) VALUES
('TECHCORP_IN', 'TCI_EMP002', 'Casual Leave', 12, 5, 0),
('TECHCORP_IN', 'TCI_EMP002', 'Sick Leave', 8, 2, 0),
('TECHCORP_IN', 'TCI_EMP002', 'Earned Leave', 18, 6, 2), -- 2 leaves pending approval
('TECHCORP_IN', 'TCI_MGR001', 'Casual Leave', 12, 3, 0),
('TECHCORP_IN', 'TCI_EMP004', 'Casual Leave', 12, 1, 0);
 
INSERT INTO LeaveBalances (organization_id, user_id, leave_type,
total_allotted, leaves_taken, leaves_pending_approval) VALUES
('MGFAB_GLOBAL', 'MGF_EMP002', 'Casual Leave', 10, 4, 0),
('MGFAB_GLOBAL', 'MGF_EMP002', 'Sick Leave', 7, 1, 0);
 
INSERT INTO CompanyPolicies (organization_id, policy_title,
policy_category, policy_content, last_reviewed, keywords) VALUES
('TECHCORP_IN', 'Work from Home Policy', 'HR General',
'Employees are allowed to work from home for up to 2 days a
week, with prior manager approval. Ensure stable internet
connection and productive environment. This applies to all
non-production roles.', '2024-10-01', 'WFH, remote, flexible,
home, policy'),
('TECHCORP_IN', 'Travel & Expense Policy', 'Expense', 'All
business travel expenses must be pre-approved by your manager.
Reimbursements require submission of original receipts within 7
days. Daily allowance for domestic travel is INR 1500.',
'2023-11-15', 'travel, expense, reimbursement, allowance,
policy'),
('TECHCORP_IN', 'Next Company Holiday', 'Calendar', 'The next
company holiday for all TechCorp employees in Bangalore is
Independence Day, August 15, 2025.', '2025-01-01', 'holiday,
vacation, August 15, Independence Day');
 
INSERT INTO CompanyPolicies (organization_id, policy_title,
policy_category, policy_content, last_reviewed, keywords) VALUES
('MGFAB_GLOBAL', 'Attendance & Punctuality Policy', 'HR
General', 'All factory employees must clock in daily using
biometric scanners. Lateness will result in a deduction from pay
after 3 instances. Strict adherence to shift timings is
required.', '2024-03-01', 'attendance, punctuality, clock-in,
biometric, policy'),
('MGFAB_GLOBAL', 'Safety Regulations Policy', 'Safety', 'All
personnel must wear mandatory safety gear (helmets, gloves,
safety shoes) in production areas. Report any hazards
immediately. Regular safety drills are conducted.',
'2024-01-20', 'safety, regulations, PPE, hazards, drills,
policy'),
('MGFAB_GLOBAL', 'Bihar State Holidays 2025', 'Calendar',
'Upcoming public holidays in UP for 2025 include Diwali (Oct
29), Chhath Puja (Nov 5-6), and Christmas (Dec 25).',
'2025-01-01', 'UP, holiday, public holiday, festival');
 
INSERT INTO PayrollData (organization_id, user_id, base_salary,
HRA, conveyance_allowance, medical_allowance, pf_deduction,
esi_deduction, professional_tax, ctc) VALUES
('TECHCORP_IN', 'TCI_MGR001', 80000.00, 40000.00, 8000.00,
3000.00, 9600.00, 0.00, 200.00, 150000.00),
('TECHCORP_IN', 'TCI_EMP002', 45000.00, 22500.00, 4500.00,
1500.00, 5400.00, 0.00, 150.00, 85000.00);
 
INSERT INTO PayrollData (organization_id, user_id, base_salary,
HRA, conveyance_allowance, medical_allowance, pf_deduction,
esi_deduction, professional_tax, ctc) VALUES
('MGFAB_GLOBAL', 'MGF_MGR001', 60000.00, 30000.00, 6000.00,
2000.00, 7200.00, 1800.00, 100.00, 110000.00),
('MGFAB_GLOBAL', 'MGF_EMP002', 30000.00, 15000.00, 3000.00,
1000.00, 3600.00, 900.00, 50.00, 55000.00);

-- Admins table for admin login
CREATE TABLE IF NOT EXISTS Admins (
    admin_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100)
);
