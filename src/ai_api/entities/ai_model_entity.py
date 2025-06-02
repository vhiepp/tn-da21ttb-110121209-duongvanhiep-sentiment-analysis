from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class AIModel(Base):
    __tablename__ = "ai_models"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)
    
    version = Column(String(50), nullable=True)  # e.g., "v1.0", "v2.1"
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())