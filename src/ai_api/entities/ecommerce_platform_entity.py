from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class EcommercePlatform(Base):
    __tablename__ = "ecommerce_platforms"

    id = Column(Integer, primary_key=True, index=True)

    platform_name = Column(String(100), nullable=False, unique=True, index=True)
    platform_url = Column(String(255), nullable=False, unique=True, index=True)

    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())