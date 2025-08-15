from fastapi import FastAPI
# from database import Base, engine
from starlette.middleware.cors import CORSMiddleware
# from sockets.app import socket_app
from controllers import predict_controller  

# Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Model Management API")

# app.mount("/socket.io", socket_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_controller.router, prefix="/predict", tags=["predict"])
