# Cloud-Based Smart Campus Monitoring System 🎓☁️

A production-grade, 3-tier cloud web application designed for engineering colleges and university campuses to streamline student lifecycle management, attendance tracking, campus circular broadcasting, and grievance redressal with automated ticket tracking.

---

## 🏛️ System Architecture

The project follows a decoupled **3-Tier Cloud Architecture**:

```
[ Client Layer (HTML5, CSS3, React 18, Tailwind CSS) ]
                        │
                        ▼ HTTPS (Port 443 / 80)
[ Web & Reverse Proxy Tier (Nginx on AWS EC2 Ubuntu 22.04 LTS) ]
                        │
                        ▼ UNIX Domain Socket (`smartcampus.sock`)
[ Application Tier (Gunicorn WSGI + Python Flask REST API) ]
                        │
        ┌───────────────┴───────────────┐
        ▼ (Port 3306)                   ▼ (HTTPS via Boto3)
[ AWS RDS MySQL 8.0 ]           [ AWS S3 Object Store ]
  • Normalized relational data    • Grievance photo evidence
  • 5 Core tables (3NF)           • Lab report attachments
  • Foreign key cascade rules     • Unstructured documents
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, TypeScript, React, Tailwind CSS | High-contrast responsive single-page portal |
| **Backend** | Python 3.10+, Flask, Flask-Bcrypt, PyJWT | RESTful API endpoints & modular Blueprints |
| **Database** | MySQL 8.0 (AWS RDS) | 3NF relational persistence with composite keys |
| **Cloud Compute** | AWS EC2 (t2.micro / Ubuntu 22.04) | Gunicorn WSGI server & Nginx reverse proxy |
| **Cloud Storage** | AWS S3 (`smart-campus-attachments-prod`) | Grievance photo proofs & document attachments |
| **DevOps** | Systemd, Git, GitHub, Nginx, Boto3 | Service daemon auto-restarts & reverse proxy |

---

## 👥 User Roles & Capabilities

### 1. Student Portal
* **Authentication**: Student login & secure registration with Student ID validation.
* **Personal Profile**: View roll number, enrolled department, semester, academic CGPA, and contact details.
* **Attendance Log**: Session-by-session subject logs with 75% minimum threshold warning rings.
* **Campus Circulars**: Filter official college circulars by department and priority (`Urgent`, `Important`, `Normal`).
* **Grievance Lodging**: Lodge complaints with automated ticket generation (`CMP-2026-XXX`) and direct AWS S3 photo evidence upload.
* **Ticket Tracking**: 3-stage visual progress stepper tracking real-time administrator remarks and resolutions.

### 2. Admin / Faculty Console
* **Dean Overview**: Real-time KPI dashboard aggregating total enrolled scholars, campus attendance percentage, open grievances, and active circulars.
* **Student Directory Management**: Full CRUD operations with instant search, department filtering, and cascade integrity.
* **Attendance Register**: Faculty batch-marking console with 1-click "All Present" / "All Absent" shortcuts, committing composite keys `(student_id, date, subject)` to RDS.
* **Grievance Redressal Desk**: Inspect S3 photo attachments, dispatch technicians, and record official administrator remarks.
* **Notice Broadcasting**: Publish campus-wide or department-specific announcements with pin-to-top controls.

---

## 🗄️ Relational Database Schema (MySQL)

```sql
CREATE DATABASE smart_campus_db;
USE smart_campus_db;

-- 1. users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    student_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. students
CREATE TABLE students (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cgpa DECIMAL(3, 2) DEFAULT 8.00,
    section VARCHAR(10) DEFAULT 'A',
    guardian_name VARCHAR(120),
    guardian_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. attendance
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(120) NOT NULL DEFAULT 'General Lecture',
    status ENUM('Present', 'Absent', 'Late', 'Leave') NOT NULL DEFAULT 'Present',
    recorded_by VARCHAR(100) DEFAULT 'Faculty Console',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_date_sub (student_id, date, subject)
);

-- 4. announcements
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'All Departments',
    priority ENUM('normal', 'important', 'urgent') NOT NULL DEFAULT 'normal',
    author VARCHAR(100) NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. complaints
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_no VARCHAR(50) NOT NULL UNIQUE,
    student_id VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    category ENUM('Infrastructure', 'Hostel', 'Academics', 'Mess & Canteen', 'Laboratory', 'Transport', 'Library', 'Other') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') NOT NULL DEFAULT 'Pending',
    admin_remarks TEXT NULL,
    attachment_name VARCHAR(255) NULL,
    attachment_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
```

---

## 🚀 Step-by-Step AWS Deployment

### 1. Launch AWS EC2 Instance
* Choose **Ubuntu Server 22.04 LTS**, Instance Type `t2.micro` (Free Tier eligible).
* Configure Security Group:
  * Port 22 (SSH) - Restrict to your IP
  * Port 80 (HTTP) - Anywhere (0.0.0.0/0)
  * Port 443 (HTTPS) - Anywhere (0.0.0.0/0)

### 2. Configure AWS RDS (MySQL)
* Engine: MySQL 8.0, Free Tier (`db.t3.micro`).
* Attach VPC Security Group allowing inbound TCP traffic on Port 3306 originating strictly from the EC2 Security Group ID.
* Connect from EC2 and run `schema.sql`.

### 3. Provision AWS S3 Bucket
* Create S3 bucket: `smart-campus-attachments-prod`.
* Enable CORS for web uploads and attach an IAM role or credentials with `s3:PutObject` and `s3:GetObject` policies.

### 4. Setup Gunicorn & Nginx on EC2
```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nginx git
git clone https://github.com/your-username/smart-campus-monitoring.git
cd smart-campus-monitoring
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Configure systemd daemon
sudo cp backend/systemd/smartcampus.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start smartcampus
sudo systemctl enable smartcampus

# Configure Nginx reverse proxy
sudo cp backend/nginx/smartcampus.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/smartcampus.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

---

## 📄 Fresher Resume Ready Project Description

```
Cloud-Based Smart Campus Monitoring System | Python (Flask), MySQL, AWS (EC2, RDS, S3)
• Architected a 3-tier university management system processing student profiles, attendance registers, and facility complaints with sub-second API response times.
• Built RESTful APIs using Python Flask with modular Blueprints, implementing secure authentication via Flask-Bcrypt (12 rounds) and stateless JWT tokens.
• Designed a 3NF normalized MySQL database hosted on AWS RDS with composite unique constraints ensuring attendance integrity and ON DELETE CASCADE protection.
• Integrated AWS S3 via Boto3 with client-side file validation and UUID sanitization for secure grievance photo evidence storage.
• Deployed production build to AWS EC2 Ubuntu 22.04 LTS instance with Gunicorn WSGI, Systemd auto-restart daemon, and Nginx reverse proxy.
```

---

## 📝 License
Licensed under Apache 2.0. Developed for academic and university administration systems.
