import mysql.connector
from mysql.connector import pooling
from config import Config

# Initialize connection pool to prevent socket starvation
db_pool = pooling.MySQLConnectionPool(
    pool_name="smartcampus_pool",
    pool_size=10,
    pool_reset_session=True,
    host=Config.MYSQL_HOST,
    user=Config.MYSQL_USER,
    password=Config.MYSQL_PASSWORD,
    database=Config.MYSQL_DB,
    port=Config.MYSQL_PORT
)

def get_db_connection():
    """Retrieve a thread-safe connection from the connection pool."""
    try:
        connection = db_pool.get_connection()
        return connection
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        raise err
