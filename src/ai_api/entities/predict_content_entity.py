from sqlalchemy import Column, Integer, String, Enum, DateTime, func
from database import Base
from sqlalchemy.dialects.mysql import MEDIUMTEXT

class PredictContent(Base):
    __tablename__ = "predict_contents"

    id = Column(Integer, primary_key=True, index=True)

    predict_history_id = Column(Integer, nullable=False, index=True)

    content = Column(MEDIUMTEXT, nullable=False, index=True)
    model_id = Column(Integer, nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())