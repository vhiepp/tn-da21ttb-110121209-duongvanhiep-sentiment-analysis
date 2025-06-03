from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_path = "ai_models/phobert_sentiment_model"
tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=False)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
model.eval()
