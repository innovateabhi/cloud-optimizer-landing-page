import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "ap-south-2")

# Database Configuration (Supports MySQL locally and Postgres in production)
DB_ENGINE = os.getenv("DB_ENGINE", "mysql").lower()
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "3306" if DB_ENGINE == "mysql" else "5432"))
DB_NAME = os.getenv("DB_NAME", "cloud_optimization_db")
DB_USER = os.getenv("DB_USER", "root" if DB_ENGINE == "mysql" else "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
