from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
import datetime
from database.db import get_db_connection
from config import Config

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student')
    student_id = data.get('student_id')

    if not username or not email or not password:
        return jsonify({'message': 'Username, email, and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check existing user
        cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
        if cursor.fetchone():
            return jsonify({'message': 'User with this email or username already exists'}), 409

        # Hash password with bcrypt (12 rounds)
        password_hash = bcrypt.generate_password_hash(password, rounds=12).decode('utf-8')

        cursor.execute(
            """INSERT INTO users (username, email, password_hash, role, student_id)
               VALUES (%s, %s, %s, %s, %s)""",
            (username, email, password_hash, role, student_id)
        )
        conn.commit()

        return jsonify({'message': 'Account registered successfully', 'role': role}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        # Generate JWT Token (valid 24h)
        token_payload = {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'student_id': user.get('student_id'),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(token_payload, Config.JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role'],
                'student_id': user.get('student_id')
            }
        }), 200
    finally:
        cursor.close()
        conn.close()
