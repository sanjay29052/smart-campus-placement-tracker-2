from flask import Blueprint, request, jsonify
from database.db import get_db_connection
from services.s3_service import upload_file_to_s3
import datetime
import random

complaints_bp = Blueprint('complaints', __name__)

@complaints_bp.route('', methods=['GET'])
def get_complaints():
    student_id = request.args.get('student_id')
    status = request.args.get('status')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT c.*, s.name as student_name, s.department 
            FROM complaints c
            LEFT JOIN students s ON c.student_id = s.student_id
            WHERE 1=1
        """
        params = []

        if student_id:
            query += " AND c.student_id = %s"
            params.append(student_id)

        if status and status != 'All':
            query += " AND c.status = %s"
            params.append(status)

        query += " ORDER BY c.created_at DESC"
        cursor.execute(query, tuple(params))
        complaints = cursor.fetchall()
        return jsonify(complaints), 200
    finally:
        cursor.close()
        conn.close()

@complaints_bp.route('', methods=['POST'])
def create_complaint():
    # Supports multipart/form-data for S3 attachment upload
    student_id = request.form.get('student_id')
    subject = request.form.get('subject')
    category = request.form.get('category')
    description = request.form.get('description')

    if not student_id or not subject or not description:
        return jsonify({'message': 'student_id, subject, and description are required'}), 400

    attachment_name = None
    attachment_url = None

    if 'file' in request.files:
        uploaded_file = request.files['file']
        if uploaded_file and uploaded_file.filename != '':
            attachment_name, attachment_url = upload_file_to_s3(uploaded_file, folder="grievances")

    # Generate unique ticket number
    year = datetime.datetime.now().year
    ticket_no = f"CMP-{year}-{random.randint(100, 999)}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """INSERT INTO complaints 
               (ticket_no, student_id, subject, category, description, status, attachment_name, attachment_url)
               VALUES (%s, %s, %s, %s, %s, 'Pending', %s, %s)""",
            (ticket_no, student_id, subject, category, description, attachment_name, attachment_url)
        )
        conn.commit()
        return jsonify({
            'message': 'Complaint lodged successfully',
            'ticket_no': ticket_no,
            'attachment_url': attachment_url
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@complaints_bp.route('/<int:complaint_id>/status', methods=['PUT'])
def update_status(complaint_id):
    data = request.get_json() or {}
    status = data.get('status')
    admin_remarks = data.get('admin_remarks', '')

    if not status:
        return jsonify({'message': 'Status is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """UPDATE complaints 
               SET status = %s, admin_remarks = %s 
               WHERE id = %s""",
            (status, admin_remarks, complaint_id)
        )
        conn.commit()
        return jsonify({'message': 'Complaint status updated successfully'}), 200
    finally:
        cursor.close()
        conn.close()
