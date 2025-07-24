from fastapi import APIRouter, HTTPException
from models.predict_model import PredictRequest
router = APIRouter()


@router.post("/")
def predict_text(predict: PredictRequest):
    from services.predict_service import predict_sentiment2

    try:
        predicted_class, prob_percentage = predict_sentiment2(predict.text)
        return {
            "predicted_class": predicted_class,
            "prob_percentages": prob_percentage
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))