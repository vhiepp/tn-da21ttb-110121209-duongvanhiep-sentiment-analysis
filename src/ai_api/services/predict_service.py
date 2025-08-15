from core.phobert_loader import model, tokenizer
import torch
import torch.nn.functional as F
import re
import emoji
import pandas as pd

def clean_comment(text):
    if pd.isnull(text):
        return ""
    text = text.lower()  # chuyển thành chữ thường
    text = emoji.replace_emoji(text, replace='')  # loại bỏ emoji
    text = re.sub(r'[^a-zA-Z0-9\sàáạãảâấầậẫẩăắằẵặẳèéẹẽẻêềếệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđ]', '', text)  # loại bỏ kí tự đặc biệt (giữ tiếng Việt)
    text = re.sub(r'\s+', ' ', text).strip()  # loại bỏ khoảng trắng thừa
    return text

def predict_sentiment(text):
    # Tiền xử lý
    # segmented_text = word_segment(text)
    text = clean_comment(text)

    # Tokenize
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=512)

    # Dự đoán
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    return predicted_class

def predict_sentiment2(text):
    # Tiền xử lý
    # segmented_text = word_segment(text)
    text = clean_comment(text)

    # Tokenize
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=512)

    # Dự đoán
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
        probs = F.softmax(logits, dim=1)

    prob_percentages = probs.squeeze().tolist()

    return predicted_class, prob_percentages