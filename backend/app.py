from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.students import students_bp
from routes.attendance import attendance_bp
from routes.complaints import complaints_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend client communications
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register modular Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(complaints_bp, url_prefix='/api/complaints')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'Cloud-Based Smart Campus Monitoring API',
            'cloud_region': Config.AWS_REGION,
            'rds_database': Config.MYSQL_DB
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    # Port 5000 in local dev; EC2 Gunicorn runs behind Nginx reverse proxy
    app.run(host='0.0.0.0', port=5000, debug=False)
