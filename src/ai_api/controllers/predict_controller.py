import time
from fastapi import APIRouter, HTTPException
from models.predict_model import PredictMultiRequest, PredictRequest
from services.predict_service import predict_sentiment2

router = APIRouter()

@router.post("/")
def predict_text(predict: PredictRequest):

    try:
        # time start
        start_time = time.perf_counter()

        predicted_class, prob_percentage = predict_sentiment2(predict.text)
        labels = ["neutral", "positive", "negative"]

        end_time = time.perf_counter()
        return {
            "text": predict.text,
            "predicted_class": labels[predicted_class],  # Adjusting index for labels
            "prob_percentages": {
                labels[0]: prob_percentage[0],
                labels[1]: prob_percentage[1],
                labels[2]: prob_percentage[2]
            },
            "time": end_time - start_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/multi")
def predict_text(predicts: PredictMultiRequest):
    
    try:
        results = []
        
        start_time = time.perf_counter()    
        for text in predicts.texts:
            predicted_class, prob_percentage = predict_sentiment2(text)
            labels = ["neutral", "positive", "negative"]
            results.append({
                "text": text,
                "predicted_class": labels[predicted_class],  # Adjusting index for labels
                "prob_percentages": {
                    labels[0]: prob_percentage[0],
                    labels[1]: prob_percentage[1],
                    labels[2]: prob_percentage[2]
                }
            })
        end_time = time.perf_counter()
        return {
            "results": results,
            "time": end_time - start_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))