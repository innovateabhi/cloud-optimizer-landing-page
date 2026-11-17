from app.config import (
    DB_ENGINE,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD
)

def get_db_connection():
    """
    Returns a database connection based on DB_ENGINE ('mysql' or 'postgres').
    """
    if DB_ENGINE == "postgres":
        try:
            import psycopg2
            return psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD
            )
        except ImportError:
            raise ImportError("psycopg2 is required when DB_ENGINE is 'postgres'.")
    else:
        # Default: MySQL
        import pymysql
        return pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            autocommit=False
        )

def is_mysql():
    return DB_ENGINE == "mysql"
