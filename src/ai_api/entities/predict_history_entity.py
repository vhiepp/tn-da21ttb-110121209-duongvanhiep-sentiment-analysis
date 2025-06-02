from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from database import Base

class PredictHistory(Base):
    __tablename__ = "predict_histories"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True)
    model_id = Column(Integer, nullable=False)

    product_link = Column(String(255), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())