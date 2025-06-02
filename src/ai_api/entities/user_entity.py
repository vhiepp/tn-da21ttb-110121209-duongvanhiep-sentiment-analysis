from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from database import Base
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class UserPlatform(enum.Enum):
    GOOGLE = "google"
    FACEBOOK = "facebook"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True)
    
    username = Column(String(100), unique=True, index=True)
    password = Column(String(100), nullable=False)

    role = Column(Enum(UserRole), nullable=False, default=UserRole.GUEST)
    platform = Column(Enum(UserPlatform), nullable=True)  # Nullable for users not using social login
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())