from fastapi import FastAPI
# from app.controllers import sentiment_controller

app = FastAPI(title="PhoBERT Sentiment API")

# app.include_router(sentiment_controller.router, prefix="/sentiment")
