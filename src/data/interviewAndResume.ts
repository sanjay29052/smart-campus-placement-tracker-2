import { InterviewQA } from '../types';

export const RESUME_BULLETS = [
  "Architected and deployed a multi-tier, full-stack **Cloud-Based Smart Campus Monitoring System** utilizing Python (Flask), MySQL, and AWS cloud infrastructure (EC2, RDS, S3).",
  "Engineered role-based authentication and secure session management with Bcrypt 12-round salted password hashing, safeguarding administrative and student record workflows.",
  "Designed and normalized relational MySQL database schemas (3NF) across 5 core entities, establishing foreign key cascades, unique compound indexes, and ACID compliance.",
  "Constructed RESTful API endpoints for automated student onboarding, daily attendance analytics (90%+ calculation accuracy), announcements, and grievance tracking.",
  "Integrated AWS S3 utilizing Boto3 with pre-signed URLs and MIME-type validation for secure storage of student complaint evidence files.",
  "Configured production deployment on Ubuntu AWS EC2 utilizing Gunicorn WSGI application server with 3 worker processes, reverse-proxied behind Nginx with systemd service supervision."
];

export const AWS_DEPLOYMENT_STEPS = [
  {
    step: 1,
    title: "Launch AWS EC2 Ubuntu Instance",
    detail: "Provision a t2.micro or t3.small instance running Ubuntu 22.04 LTS. Under Security Groups, configure Inbound Rules: SSH (port 22, My IP), HTTP (port 80, 0.0.0.0/0), and HTTPS (port 443, 0.0.0.0/0). Save your .pem key pair."
  },
  {
    step: 2,
    title: "Connect via SSH & Provision System Packages",
    detail: "Run: chmod 400 your-key.pem && ssh -i your-key.pem ubuntu@<ec2-public-ip>. Then update and install dependencies: sudo apt update && sudo apt install -y python3-pip python3-venv nginx git mysql-client."
  },
  {
    step: 3,
    title: "Create AWS RDS MySQL Database Instance",
    detail: "Open AWS RDS Console -> Create Database -> Engine: MySQL (Free Tier) -> DB identifier: 'smart-campus-db'. Set Master username: 'admin' and a strong password. Ensure VPC Security Group allows inbound traffic on port 3306 from the EC2 Security Group ID only (never 0.0.0.0/0 for security)."
  },
  {
    step: 4,
    title: "Initialize Database Schema on RDS",
    detail: "From your EC2 terminal: mysql -h <rds-endpoint.amazonaws.com> -P 3306 -u admin -p < database/schema.sql. This creates the smart_campus_db, all 5 normalized tables, foreign keys, and indexes."
  },
  {
    step: 5,
    title: "Create AWS S3 Bucket & IAM Policy",
    detail: "Create an S3 bucket named 'smart-campus-attachments-prod'. Enable Block All Public Access (or create a scoped bucket policy). In IAM Console, create an EC2 IAM Role with AmazonS3FullAccess policy attached to your EC2 instance so credentials don't need to be hardcoded."
  },
  {
    step: 6,
    title: "Clone Project & Set Up Python Virtual Environment",
    detail: "On EC2: git clone <repo_url> smart-campus && cd smart-campus. Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt. Create .env file with your RDS host and secret keys."
  },
  {
    step: 7,
    title: "Configure Gunicorn WSGI & Systemd Daemon",
    detail: "Test run: gunicorn --bind 0.0.0.0:5000 app:app. Then create systemd service at /etc/systemd/system/smartcampus.service to ensure automated restarts: sudo systemctl daemon-reload && sudo systemctl start smartcampus && sudo systemctl enable smartcampus."
  },
  {
    step: 8,
    title: "Configure Nginx Reverse Proxy & Let's Encrypt SSL",
    detail: "Configure /etc/nginx/sites-available/smartcampus to proxy HTTP requests to Unix socket /home/ubuntu/smart-campus/smartcampus.sock. Run sudo ln -s ... /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl restart nginx. Optionally run certbot --nginx for free HTTPS."
  }
];

export const INTERVIEW_QUESTIONS: InterviewQA[] = [
  {
    id: 1,
    category: "System Architecture",
    question: "Walk me through the high-level architecture of your Cloud-Based Smart Campus Monitoring System.",
    answer: "The application uses a classical 3-tier cloud architecture. The Presentation tier is a modern responsive dashboard built with semantic HTML5, modern CSS, and JavaScript consuming REST APIs. The Application tier is a Python Flask backend serving modular Blueprints (auth, students, attendance, complaints, announcements), running on an AWS EC2 Ubuntu instance managed by Gunicorn and Nginx. The Data tier is split: structured relational data resides in an AWS RDS MySQL database with strict foreign keys and indexes, while unstructured media files (complaint evidence photos, PDFs) are offloaded to an AWS S3 bucket to maintain database speed and minimize disk I/O.",
    keyPoints: ["3-tier architecture: Client, Flask App Server on EC2, RDS MySQL + S3", "Gunicorn WSGI + Nginx reverse proxy", "Separation of structured vs blob data"]
  },
  {
    id: 2,
    category: "Security & Best Practices",
    question: "How do you securely handle user passwords and authentication in this Flask project?",
    answer: "Passwords are never stored in plaintext. We utilize Flask-Bcrypt which implements the Blowfish cipher with automatic salting (12 rounds of hashing). On registration, `bcrypt.generate_password_hash(password)` generates an irreversible hash stored in the `password_hash` column. On login, `bcrypt.check_password_hash()` compares the candidate string against the hashed string. Furthermore, session management uses HTTP-Only and SameSite cookies to protect against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).",
    keyPoints: ["Bcrypt with salt rounds", "Never store plaintext", "HTTP-Only & SameSite cookie attributes"]
  },
  {
    id: 3,
    category: "MySQL & DB Design",
    question: "Explain the database schema design and how you ensured relational integrity.",
    answer: "The schema is normalized to Third Normal Form (3NF). We have 5 primary tables: `users`, `students`, `attendance`, `announcements`, and `complaints`. Foreign key constraints enforce referential integrity: `students.user_id` references `users.id`, and `attendance.student_id` as well as `complaints.student_id` reference `students.student_id` with `ON DELETE CASCADE`. A composite unique constraint `(student_id, date, subject)` on the attendance table prevents duplicate attendance marks for the same student on a single day. Indexes are added to frequently queried columns like `department`, `status`, and `date`.",
    keyPoints: ["3NF normalization", "Foreign key cascades & referential integrity", "Composite UNIQUE constraint on attendance", "B-Tree Indexes on search/filter columns"]
  },
  {
    id: 4,
    category: "AWS Cloud Deployment",
    question: "Why did you decouple file storage into AWS S3 instead of saving uploaded files directly on the EC2 disk or inside MySQL as BLOBs?",
    answer: "Storing binary media directly in MySQL as BLOBs bloats the database size, slows down backups, pollutes buffer pool caches, and degrades query performance. Storing files locally on the EC2 instance's EBS volume couples state to a single server, making horizontal scaling impossible (if you add an auto-scaling group of EC2 instances, instances wouldn't share local disks). AWS S3 provides 99.999999999% (11 9s) durability, unlimited elastic scalability, and direct URL delivery via CDNs (CloudFront) without loading the EC2 CPU.",
    keyPoints: ["Avoid database bloat and buffer pool cache eviction", "Stateless EC2 instances enabling horizontal autoscaling", "11 9s durability and low cost on S3"]
  },
  {
    id: 5,
    category: "Flask & REST APIs",
    question: "Why did you choose Flask over Django for this Smart Campus application?",
    answer: "Flask is a lightweight micro-framework that provides freedom of architecture. For a microservices or clean REST API pattern where we decouple frontend and backend, Flask allows us to import only what we need without the heavy overhead of Django's built-in monolithic ORM and admin site. We used Flask Blueprints to cleanly separate domain logic into modular routes (`auth_bp`, `students_bp`, `attendance_bp`, `complaints_bp`), which mimics production enterprise project structures.",
    keyPoints: ["Lightweight, low memory footprint", "Modular separation using Flask Blueprints", "Easier integration with custom DB connectors and AWS SDKs"]
  },
  {
    id: 6,
    category: "AWS Cloud Deployment",
    question: "What is the role of Gunicorn and Nginx in your AWS EC2 deployment?",
    answer: "Flask's built-in development server (`app.run()`) is single-threaded and not designed for concurrent production traffic. Gunicorn acts as a production WSGI (Web Server Gateway Interface) HTTP server, running a master process with multiple worker processes (typically 2 * CPU_cores + 1) to handle concurrent requests asynchronously. Nginx acts as a reverse proxy in front of Gunicorn: it handles SSL termination, serves static assets (CSS/JS/images) with disk caching, protects Gunicorn from slow clients (Slowloris attacks), and routes API requests via a Unix socket.",
    keyPoints: ["Gunicorn: WSGI multi-worker process manager", "Nginx: Reverse proxy, SSL termination, static file caching", "Prevents Flask dev server crash on concurrent loads"]
  },
  {
    id: 7,
    category: "Security & Best Practices",
    question: "How do you protect database credentials and AWS access keys from being exposed?",
    answer: "We strictly follow the Twelve-Factor App methodology. No secrets or credentials are hardcoded into Git. We use `python-dotenv` and read values from an uncommitted `.env` file via `os.getenv()`. In production AWS environments, best practice is to attach an IAM Role (Instance Profile) to the EC2 instance, allowing the AWS Boto3 SDK to automatically fetch rotating temporary credentials from the AWS Instance Metadata Service (IMDSv2), eliminating the need for hardcoded AWS_ACCESS_KEY_ID strings entirely.",
    keyPoints: ["Twelve-Factor app principles", ".env and environment variables", "IAM Roles on EC2 avoiding permanent access keys"]
  },
  {
    id: 8,
    category: "MySQL & DB Design",
    question: "How does the system calculate student attendance percentages efficiently when there are thousands of records?",
    answer: "Rather than fetching thousands of rows into Python memory and looping in application code, we leverage SQL aggregation functions: `COUNT(id) AS total_classes` and `SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) AS attended_classes`. By running aggregation on the MySQL RDS server with an index on `(student_id, status)`, the query executes in sub-millisecond time. The calculated percentage is returned cleanly through the REST endpoint.",
    keyPoints: ["Database-level SQL aggregation (COUNT, SUM CASE WHEN)", "Avoid memory exhaustion in Python app server", "Index on student_id and status"]
  },
  {
    id: 9,
    category: "Flask & REST APIs",
    question: "What HTTP status codes and error handling patterns did you implement?",
    answer: "We follow RESTful conventions: 200 OK for successful fetches/updates, 201 Created for new resources (e.g. registration, new complaint ticket), 400 Bad Request for validation errors (missing required fields), 401 Unauthorized for bad credentials, 403 Forbidden for insufficient role permissions, 404 Not Found for missing student or complaint IDs, 409 Conflict for duplicate emails/student IDs, and 500 Internal Server Error with database rollback for unexpected server exceptions.",
    keyPoints: ["Semantic HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500)", "Database transaction rollback (`conn.rollback()`) on exception", "Structured JSON error envelopes `{'error': '...'}`"]
  },
  {
    id: 10,
    category: "AWS Cloud Deployment",
    question: "If you were asked to scale this system to 50,000 active concurrent college students across multiple campuses, what would you change?",
    answer: "1) Place the EC2 instances in an Auto Scaling Group behind an AWS Application Load Balancer (ALB) across multiple Availability Zones. 2) Enable AWS RDS MySQL Read Replicas to offload read-heavy queries (attendance views, announcements) while keeping writes on the primary DB. 3) Add an Amazon ElastiCache (Redis) cluster to cache frequently read data like campus announcements and student profile sessions. 4) Use AWS CloudFront CDN to serve S3 attachments and frontend static bundles globally with edge caching. 5) Implement message queues (AWS SQS) for processing file uploads and email/SMS notifications asynchronously.",
    keyPoints: ["Application Load Balancer (ALB) + Auto Scaling Group", "RDS Read Replicas", "ElastiCache Redis for caching", "CloudFront CDN for S3 assets", "AWS SQS for asynchronous jobs"]
  }
];
