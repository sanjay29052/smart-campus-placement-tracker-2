from flask import Blueprint, request, jsonify
from database.db import get_db_connection

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/student/<student_id>', methods=['GET'])
def get_student_attendance(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT * FROM attendance 
               WHERE student_id = %s 
               ORDER BY date DESC""", 
            (student_id,)
        )
        records = cursor.fetchall()

        total = len(records)
        present = sum(1 for r in records if r['status'] in ('Present', 'Late'))
        pct = round((present / total * 100), 1) if total > 0 else 0.0

        return jsonify({
            'student_id': student_id,
            'total_classes': total,
            'present_count': present,
            'attendance_percentage': pct,
            'records': records
        }), 200
    finally:
        cursor.close()
        conn.close()

@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    data = request.get_json() or {}
    records = data.get('records', [])
    date = data.get('date')
    subject = data.get('subject', 'General Lecture')
    recorded_by = data.get('recorded_by', 'Faculty')

    if not records or not date:
        return jsonify({'message': 'Records and date are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for r in records:
            cursor.execute(
                """INSERT INTO attendance (student_id, date, subject, status, recorded_by)
                   VALUES (%s, %s, %s, %s, %s)
                   ON DUPLICATE KEY UPDATE status = VALUES(status), recorded_by = VALUES(recorded_by)""",
                (r['student_id'], date, subject, r['status'], recorded_by)
            )
        conn.commit()
        return jsonify({'message': f'Attendance for {len(records)} students recorded successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
