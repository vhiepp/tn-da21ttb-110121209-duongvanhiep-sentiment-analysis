from fastapi import FastAPI
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Model Management API")

# app.include_router(sentiment_controller.router, prefix="/sentiment")
