import socketio
import requests
import time
from services.predict_service import predict_sentiment

sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
socket_app = socketio.ASGIApp(socketio_server=sio)

@sio.event
async def connect(sid, environ):
    print("Client connected:", sid)

@sio.event
async def disconnect(sid):
    print("Client disconnected:", sid)
# ///
url_comment = "https://tiki.vn/api/v2/reviews"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",   
    "accept-encoding": "gzip, deflate, br, zstd",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}
labels = {
    1: "😀",
    0: "🤝",
    2: "😤"
}
# ///
@sio.event
async def predict_event(sid, product_id: int):
    # print("Received data:", data)

    if not product_id:
        await sio.emit("prediction_result", {"error": "Product ID is required"}, to=sid)
        return

    params = {
        "limit": 20,
        "page": 1,
        "include": "comments,contribute_info,attribute_vote_summary",
        "sort": "score%7Cdesc,id%7Cdesc,stars%7Call",
        "product_id": product_id,
    }
    start_time = time.time()
    response_product = requests.get(f"https://tiki.vn/api/v2/products/{product_id}", headers=headers, params={})
    if response_product.status_code == 200:
        await sio.emit("set_name", response_product.json()["name"], to=sid)
    responsePage = requests.get(url_comment, headers=headers, params=params)
    print("Response status code:", responsePage.status_code)
    count = 0
    if responsePage.status_code == 200:
        last_page = responsePage.json()["paging"]["last_page"]
        # print("Số lượng trang:", last_page)
        # print("Số lượng comment:", cout)
        for page in range(1, last_page + 1):
            params = {
                "limit": 20,
                "page": page,
                "include": "comments,contribute_info,attribute_vote_summary",
                "sort": "score%7Cdesc,id%7Cdesc,stars%7Call",
                "product_id": product_id,
            }
            response = requests.get(url_comment, headers=headers, params=params)
            data_res = []
            if response.status_code == 200:
                data = response.json()["data"]
                # print(data)  # In ra nội dung của phản hồi
                for review in data:
                    content = review["content"].replace("\r", "").replace("\n", "")
                    if len(content) > 0:
                        predicted_class = predict_sentiment(content)
                    else:
                        predicted_class = 0
                    data_res.append({
                        "text": content,
                        "predicted_class": predicted_class
                    })
                    count += 1
                    if len(data_res) >= 5:
                        await sio.emit("prediction_result", data_res, to=sid)
                        data_res = []
            if len(data_res) > 0:
                await sio.emit("prediction_result", data_res, to=sid)
    end_time = time.time()
    elapsed_time = end_time - start_time
    await sio.emit("prediction_result", f"Xong!!! {elapsed_time}", to=sid)
    await sio.emit("prediction_result", f"So luong: {count}", to=sid)
