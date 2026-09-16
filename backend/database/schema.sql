-- Smart Campus Monitoring System
-- Database Schema for AWS RDS MySQL
-- Character Set: utf8mb4, Engine: InnoDB

CREATE DATABASE IF NOT EXISTS smart_campus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_campus_db;

-- 1. Users Table (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    student_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB;

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dept (department),
    INDEX idx_year (year)
) ENGINE=InnoDB;

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(120) NOT NULL DEFAULT 'General Lecture',
    status ENUM('Present', 'Absent', 'Late', 'Leave') NOT NULL DEFAULT 'Present',
    recorded_by VARCHAR(100) DEFAULT 'Faculty Console',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_date_sub (student_id, date, subject),
    INDEX idx_att_date (date),
    INDEX idx_att_status (status)
) ENGINE=InnoDB;

-- 4. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'All Departments',
    priority ENUM('normal', 'important', 'urgent') NOT NULL DEFAULT 'normal',
    author VARCHAR(100) NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ann_dept (department),
    INDEX idx_ann_priority (priority)
) ENGINE=InnoDB;

-- 5. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_comp_status (status),
    INDEX idx_comp_ticket (ticket_no)
) ENGINE=InnoDB;
