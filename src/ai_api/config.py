from dotenv import load_dotenv
import os

# Tải các biến môi trường từ file .env
load_dotenv()

class Settings:
    def __init__(self):
        self.db_host = os.getenv("DB_HOST", "localhost")
        self.db_port = os.getenv("DB_PORT", "3306")
        self.db_user = os.getenv("DB_USER", "root")
        self.db_password = os.getenv("DB_PASSWORD", "")
        self.db_name = os.getenv("DB_NAME", "mydb")
        self.secret_key = os.getenv("SECRET_KEY", "your_secret_key")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
        self.database_url = f"mysql+mysqlconnector://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

settings = Settings()