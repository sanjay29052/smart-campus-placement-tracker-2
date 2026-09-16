from flask import Blueprint, request, jsonify
from database.db import get_db_connection

students_bp = Blueprint('students', __name__)

@students_bp.route('', methods=['GET'])
def get_students():
    department = request.args.get('department')
    search = request.args.get('search')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT * FROM students WHERE 1=1"
        params = []

        if department and department != 'All':
            query += " AND department = %s"
            params.append(department)

        if search:
            query += " AND (name LIKE %s OR student_id LIKE %s OR email LIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])

        query += " ORDER BY created_at DESC"
        cursor.execute(query, tuple(params))
        students = cursor.fetchall()
        return jsonify(students), 200
    finally:
        cursor.close()
        conn.close()

@students_bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        return jsonify(student), 200
    finally:
        cursor.close()
        conn.close()

@students_bp.route('', methods=['POST'])
def add_student():
    data = request.get_json() or {}
    required_fields = ['student_id', 'name', 'email', 'department', 'year', 'phone']
    for f in required_fields:
        if not data.get(f):
            return jsonify({'message': f'{f} is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO students 
               (student_id, name, email, department, year, phone, cgpa, section, guardian_name, guardian_phone, address)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                data['student_id'], data['name'], data['email'], data['department'],
                data['year'], data['phone'], data.get('cgpa', 8.00), data.get('section', 'A'),
                data.get('guardian_name'), data.get('guardian_phone'), data.get('address')
            )
        )
        conn.commit()
        return jsonify({'message': 'Student added successfully', 'student_id': data['student_id']}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@students_bp.route('/<student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """UPDATE students SET 
               name = %s, email = %s, department = %s, year = %s, phone = %s, 
               cgpa = %s, section = %s, guardian_name = %s, guardian_phone = %s, address = %s
               WHERE student_id = %s""",
            (
                data.get('name'), data.get('email'), data.get('department'),
                data.get('year'), data.get('phone'), data.get('cgpa'),
                data.get('section'), data.get('guardian_name'), data.get('guardian_phone'),
                data.get('address'), student_id
            )
        )
        conn.commit()
        return jsonify({'message': 'Student updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@students_bp.route('/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM students WHERE student_id = %s", (student_id,))
        conn.commit()
        return jsonify({'message': 'Student deleted successfully'}), 200
    finally:
        cursor.close()
        conn.close()
