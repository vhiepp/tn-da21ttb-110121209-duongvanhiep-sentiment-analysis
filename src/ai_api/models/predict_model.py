from pydantic import BaseModel

class PredictRequest(BaseModel):
    text: str

class PredictMultiRequest(BaseModel):
    texts: list[str]