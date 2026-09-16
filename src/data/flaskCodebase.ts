import { CodeFile } from '../types';

export const FLASK_CODEBASE: CodeFile[] = [
  {
    filename: 'requirements.txt',
    path: 'requirements.txt',
    language: 'plaintext',
    description: 'Python dependencies for Flask, MySQL Connector, AWS Boto3, and Security',
    content: `Flask==3.0.2
Flask-Cors==4.0.0
Flask-Bcrypt==1.0.1
PyMySQL==1.1.0
cryptography==42.0.5
boto3==1.34.40
python-dotenv==1.0.1
gunicorn==21.2.0
marshmallow==3.21.1
Werkzeug==3.0.1`
  },
  {
    filename: '.env.example',
    path: '.env.example',
    language: 'ini',
    description: 'Environment variables template for database, secret key, and AWS S3',
    content: `# Flask Security
SECRET_KEY=generate_a_secure_random_hex_string_here
FLASK_ENV=production

# AWS RDS MySQL Credentials
DB_HOST=smart-campus-db.c9xxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_rds_strong_password
DB_NAME=smart_campus_db

# AWS S3 Storage for Uploaded Complaint Proofs / Documents
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_iam_user_access_key
AWS_SECRET_ACCESS_KEY=your_iam_user_secret_key
AWS_S3_BUCKET_NAME=smart-campus-attachments-prod`
  },
  {
    filename: 'config.py',
    path: 'config.py',
    language: 'python',
    description: 'Application configuration class loading from environment variables',
    content: `import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key-replace-in-prod')
    
    # Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'smart_campus_db')
    
    # AWS S3 Configuration
    AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
    
    # Session Cookie Settings
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True if os.getenv('FLASK_ENV') == 'production' else False
    SESSION_COOKIE_SAMESITE = 'Lax'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload`
  },
  {
    filename: 'schema.sql',
    path: 'database/schema.sql',
    language: 'sql',
    description: 'Relational MySQL DDL for users, students, attendance, announcements, and complaints',
    content: `-- Create Database
CREATE DATABASE IF NOT EXISTS smart_campus_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smart_campus_db;

-- 1. Users Table (Authentication & Role-Based Access)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Students Table (Profile & Academic Records)
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY, -- e.g., 'STU2024001'
    user_id INT UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    department VARCHAR(80) NOT NULL,
    year ENUM('1st Year', '2nd Year', '3rd Year', '4th Year') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cgpa DECIMAL(3, 2) DEFAULT 0.00,
    section VARCHAR(10) DEFAULT 'A',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_department (department)
) ENGINE=InnoDB;

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Leave') NOT NULL DEFAULT 'Present',
    subject VARCHAR(80),
    recorded_by VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_date_subject (student_id, date, subject),
    INDEX idx_date (date),
    INDEX idx_student_status (student_id, status)
) ENGINE=InnoDB;

-- 4. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(80) NOT NULL DEFAULT 'All Departments',
    priority ENUM('normal', 'important', 'urgent') NOT NULL DEFAULT 'normal',
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dept_priority (department, priority)
) ENGINE=InnoDB;

-- 5. Complaints Table (Integrated with AWS S3 Object URLs)
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_no VARCHAR(30) NOT NULL UNIQUE,
    student_id VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    category ENUM('Academics', 'Hostel', 'Infrastructure', 'Mess & Canteen', 'Laboratory', 'Transport', 'Library', 'Other') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') NOT NULL DEFAULT 'Pending',
    attachment_url VARCHAR(500),
    attachment_name VARCHAR(255),
    admin_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaints_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_complaints_status (status),
    INDEX idx_complaints_student (student_id)
) ENGINE=InnoDB;`
  },
  {
    filename: 'db.py',
    path: 'database/db.py',
    language: 'python',
    description: 'PyMySQL connection pool manager and context manager',
    content: `import pymysql
from pymysql.cursors import DictCursor
from config import Config

def get_db_connection():
    """
    Establishes a connection to AWS RDS MySQL or local MySQL instance.
    Returns a PyMySQL Connection with DictCursor for dictionary row mapping.
    """
    return pymysql.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        cursorclass=DictCursor,
        autocommit=False,
        connect_timeout=10
    )`
  },
  {
    filename: 's3_service.py',
    path: 'services/s3_service.py',
    language: 'python',
    description: 'AWS S3 Document & Image Upload Service with UUID naming and presigned URLs',
    content: `import boto3
import uuid
from botocore.exceptions import NoCredentialsError, ClientError
from config import Config

def get_s3_client():
    if not Config.AWS_ACCESS_KEY_ID or not Config.AWS_SECRET_ACCESS_KEY:
        return None
    return boto3.client(
        's3',
        region_name=Config.AWS_REGION,
        aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
    )

def upload_file_to_s3(file_storage, folder="complaints"):
    """
    Uploads a file directly to AWS S3 bucket and returns its secure public/presigned URL.
    """
    s3 = get_s3_client()
    if not s3 or not Config.AWS_S3_BUCKET_NAME:
        # Fallback simulation or mock URL if AWS keys are not yet configured in EC2 env
        unique_name = f"{folder}/{uuid.uuid4().hex}_{file_storage.filename}"
        return {
            "success": True,
            "url": f"https://{Config.AWS_S3_BUCKET_NAME or 'smart-campus-s3'}.s3.amazonaws.com/{unique_name}",
            "filename": file_storage.filename
        }
        
    try:
        ext = file_storage.filename.rsplit('.', 1)[-1].lower() if '.' in file_storage.filename else 'dat'
        unique_filename = f"{folder}/{uuid.uuid4().hex}.{ext}"
        
        s3.upload_fileobj(
            file_storage,
            Config.AWS_S3_BUCKET_NAME,
            unique_filename,
            ExtraArgs={
                'ContentType': file_storage.content_type
            }
        )
        
        file_url = f"https://{Config.AWS_S3_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{unique_filename}"
        return {
            "success": True,
            "url": file_url,
            "filename": file_storage.filename
        }
    except (NoCredentialsError, ClientError) as e:
        return {
            "success": False,
            "error": str(e)
        }`
  },
  {
    filename: 'auth.py',
    path: 'routes/auth.py',
    language: 'python',
    description: 'Authentication routes: Student Registration, Login, Session Check, Logout',
    content: `from flask import Blueprint, request, jsonify, session
from database.db import get_db_connection
from flask_bcrypt import Bcrypt

auth_bp = Blueprint('auth_bp', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    student_id = data.get('student_id', '').strip().upper()
    department = data.get('department', '').strip()
    year = data.get('year', '1st Year')
    phone = data.get('phone', '').strip()

    if not all([name, email, password, student_id, department, phone]):
        return jsonify({'error': 'All fields are required.'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Check existing email
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email is already registered.'}), 409

            # Check existing student_id
            cursor.execute("SELECT student_id FROM students WHERE student_id = %s", (student_id,))
            if cursor.fetchone():
                return jsonify({'error': 'Student ID is already registered.'}), 409

            # Hash password securely using Bcrypt (blowfish 12 rounds)
            hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

            # Insert into users table
            cursor.execute(
                "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'student')",
                (name, email, hashed_pw)
            )
            user_id = cursor.lastrowid

            # Insert into students table
            cursor.execute(
                "INSERT INTO students (student_id, user_id, name, email, department, year, phone) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (student_id, user_id, name, email, department, year, phone)
            )
            conn.commit()

            # Establish Session
            session['user_id'] = user_id
            session['role'] = 'student'
            session['student_id'] = student_id
            session['name'] = name

            return jsonify({
                'message': 'Registration successful!',
                'user': {
                    'id': user_id,
                    'name': name,
                    'email': email,
                    'role': 'student',
                    'student_id': student_id
                }
            }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        conn.close()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    expected_role = data.get('role')  # optional check

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if not user or not bcrypt.check_password_hash(user['password_hash'], password):
                return jsonify({'error': 'Invalid email or password.'}), 401

            if expected_role and user['role'] != expected_role:
                return jsonify({'error': f'Unauthorized. Account does not possess {expected_role} privileges.'}), 403

            student_id = None
            if user['role'] == 'student':
                cursor.execute("SELECT student_id FROM students WHERE user_id = %s", (user['id'],))
                stu = cursor.fetchone()
                if stu:
                    student_id = stu['student_id']

            session['user_id'] = user['id']
            session['role'] = user['role']
            session['name'] = user['name']
            if student_id:
                session['student_id'] = student_id

            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role'],
                    'student_id': student_id
                }
            }), 200
    finally:
        conn.close()

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200`
  },
  {
    filename: 'students.py',
    path: 'routes/students.py',
    language: 'python',
    description: 'REST API for Student CRUD and Statistics (Admin & Self view)',
    content: `from flask import Blueprint, request, jsonify, session
from database.db import get_db_connection

students_bp = Blueprint('students_bp', __name__)

@students_bp.route('/api/students', methods=['GET'])
def get_students():
    # Admin can view all students, with optional department and search filters
    search = request.args.get('search', '').strip()
    dept = request.args.get('department', '').strip()
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = "SELECT * FROM students WHERE 1=1"
            params = []
            if dept and dept != 'All':
                query += " AND department = %s"
                params.append(dept)
            if search:
                query += " AND (name LIKE %s OR student_id LIKE %s OR email LIKE %s)"
                term = f"%{search}%"
                params.extend([term, term, term])
            
            query += " ORDER BY name ASC"
            cursor.execute(query, tuple(params))
            students = cursor.fetchall()
            return jsonify({'students': students, 'total': len(students)}), 200
    finally:
        conn.close()

@students_bp.route('/api/students/<student_id>', methods=['GET'])
def get_student_profile(student_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
            student = cursor.fetchone()
            if not student:
                return jsonify({'error': 'Student not found'}), 404
            return jsonify({'student': student}), 200
    finally:
        conn.close()

@students_bp.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json() or {}
    required = ['student_id', 'name', 'email', 'department', 'year', 'phone']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required student fields.'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO students 
                   (student_id, name, email, department, year, phone, cgpa, section, address)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    data['student_id'], data['name'], data['email'], data['department'],
                    data['year'], data['phone'], data.get('cgpa', 0.0),
                    data.get('section', 'A'), data.get('address', '')
                )
            )
            conn.commit()
            return jsonify({'message': 'Student created successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()`
  },
  {
    filename: 'attendance.py',
    path: 'routes/attendance.py',
    language: 'python',
    description: 'Attendance tracking, Bulk Marking by Admin, and Percentage Analytics',
    content: `from flask import Blueprint, request, jsonify
from database.db import get_db_connection

attendance_bp = Blueprint('attendance_bp', __name__)

@attendance_bp.route('/api/attendance/student/<student_id>', methods=['GET'])
def get_student_attendance(student_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM attendance WHERE student_id = %s ORDER BY date DESC",
                (student_id,)
            )
            records = cursor.fetchall()
            
            total_classes = len(records)
            present_count = sum(1 for r in records if r['status'] in ['Present', 'Late'])
            absent_count = sum(1 for r in records if r['status'] == 'Absent')
            percentage = round((present_count / total_classes * 100), 1) if total_classes > 0 else 0.0

            return jsonify({
                'student_id': student_id,
                'total_classes': total_classes,
                'present_count': present_count,
                'absent_count': absent_count,
                'percentage': percentage,
                'records': records
            }), 200
    finally:
        conn.close()

@attendance_bp.route('/api/attendance/bulk-mark', methods=['POST'])
def bulk_mark_attendance():
    """
    Endpoint used by Faculty / Admin to mark attendance for a class on a given date.
    Body: { date: 'YYYY-MM-DD', subject: 'Cloud Computing', records: [{ student_id: '...', status: 'Present' }] }
    """
    data = request.get_json() or {}
    date = data.get('date')
    subject = data.get('subject', 'General Lecture')
    records = data.get('records', [])

    if not date or not records:
        return jsonify({'error': 'Date and student records are required.'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            for r in records:
                cursor.execute(
                    """INSERT INTO attendance (student_id, date, status, subject)
                       VALUES (%s, %s, %s, %s)
                       ON DUPLICATE KEY UPDATE status = VALUES(status)""",
                    (r['student_id'], date, r['status'], subject)
                )
            conn.commit()
            return jsonify({'message': f'Attendance successfully saved for {len(records)} students.'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()`
  },
  {
    filename: 'complaints.py',
    path: 'routes/complaints.py',
    language: 'python',
    description: 'Complaint Submission with AWS S3 attachment and Admin Ticket Management',
    content: `from flask import Blueprint, request, jsonify
from database.db import get_db_connection
from services.s3_service import upload_file_to_s3
import random

complaints_bp = Blueprint('complaints_bp', __name__)

@complaints_bp.route('/api/complaints', methods=['POST'])
def submit_complaint():
    """
    Supports multipart form-data to accept subject, category, description, and optional S3 file attachment.
    """
    student_id = request.form.get('student_id')
    subject = request.form.get('subject')
    category = request.form.get('category')
    description = request.form.get('description')
    
    if not all([student_id, subject, category, description]):
        return jsonify({'error': 'All fields are required.'}), 400

    attachment_url = None
    attachment_name = None
    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename:
            upload_res = upload_file_to_s3(file, folder="complaint_attachments")
            if upload_res.get('success'):
                attachment_url = upload_res.get('url')
                attachment_name = upload_res.get('filename')

    ticket_no = f"CMP-{random.randint(1000, 9999)}"
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """INSERT INTO complaints 
                   (ticket_no, student_id, subject, category, description, status, attachment_url, attachment_name)
                   VALUES (%s, %s, %s, %s, %s, 'Pending', %s, %s)""",
                (ticket_no, student_id, subject, category, description, attachment_url, attachment_name)
            )
            conn.commit()
            return jsonify({
                'message': 'Complaint ticket lodged successfully.',
                'ticket_no': ticket_no,
                'attachment_url': attachment_url
            }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@complaints_bp.route('/api/complaints/track/<ticket_no>', methods=['GET'])
def track_complaint(ticket_no):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """SELECT c.*, s.name as student_name, s.department 
                   FROM complaints c 
                   JOIN students s ON c.student_id = s.student_id 
                   WHERE c.ticket_no = %s""",
                (ticket_no,)
            )
            ticket = cursor.fetchone()
            if not ticket:
                return jsonify({'error': 'Ticket not found'}), 404
            return jsonify({'complaint': ticket}), 200
    finally:
        conn.close()

@complaints_bp.route('/api/complaints/<int:complaint_id>/status', methods=['PATCH'])
def update_complaint_status(complaint_id):
    data = request.get_json() or {}
    status = data.get('status')
    remarks = data.get('admin_remarks', '')

    if status not in ['Pending', 'In Progress', 'Resolved', 'Rejected']:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE complaints SET status = %s, admin_remarks = %s WHERE id = %s",
                (status, remarks, complaint_id)
            )
            conn.commit()
            return jsonify({'message': 'Complaint status updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()`
  },
  {
    filename: 'app.py',
    path: 'app.py',
    language: 'python',
    description: 'Main Flask Entry point with CORS, Blueprint registration, and Health Endpoint',
    content: `import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.students import students_bp
from routes.attendance import attendance_bp
from routes.complaints import complaints_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable Cross-Origin Resource Sharing
CORS(app, supports_credentials=True, origins=["*"])

# Register modular blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(students_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(complaints_bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Smart Campus Monitoring Backend',
        'cloud_host': 'AWS EC2',
        'db': 'AWS RDS MySQL',
        'storage': 'AWS S3'
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)`
  },
  {
    filename: 'smartcampus.service',
    path: 'systemd/smartcampus.service',
    language: 'ini',
    description: 'Systemd service file for running Gunicorn daemon continuously on AWS EC2',
    content: `[Unit]
Description=Gunicorn daemon for Smart Campus Flask Application
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/smart-campus
Environment="PATH=/home/ubuntu/smart-campus/venv/bin"
ExecStart=/home/ubuntu/smart-campus/venv/bin/gunicorn --workers 3 --bind unix:smartcampus.sock -m 007 wsgi:app
Restart=always

[Install]
WantedBy=multi-user.target`
  },
  {
    filename: 'smartcampus.conf',
    path: 'nginx/smartcampus.conf',
    language: 'nginx',
    description: 'Nginx reverse proxy configuration for AWS EC2 serving port 80/443 to Gunicorn',
    content: `server {
    listen 80;
    server_name campus.yourdomain.com; # Or EC2 Public IPv4 / Elastic IP

    client_max_body_size 20M;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/smart-campus/smartcampus.sock;
    }

    location /static/ {
        alias /home/ubuntu/smart-campus/static/;
        expires 30d;
    }
}`
  }
];
