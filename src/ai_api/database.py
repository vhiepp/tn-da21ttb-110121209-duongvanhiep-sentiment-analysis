from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

db = SessionLocal()

# Hàm get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()