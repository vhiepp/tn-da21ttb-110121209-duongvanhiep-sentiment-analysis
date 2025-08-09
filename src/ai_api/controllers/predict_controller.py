from fastapi import APIRouter, HTTPException
from models.predict_model import PredictRequest
router = APIRouter()


@router.post("/")
def predict_text(predict: PredictRequest):
    from services.predict_service import predict_sentiment2

    try:
        predicted_class, prob_percentage = predict_sentiment2(predict.text)
        labels = ["neutral", "positive", "negative"]
        return {
            "predicted_class": labels[predicted_class],  # Adjusting index for labels
            "prob_percentages": {
                labels[0]: prob_percentage[0],
                labels[1]: prob_percentage[1],
                labels[2]: prob_percentage[2]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))