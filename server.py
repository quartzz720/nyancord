from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# Basic in-memory store for messages by channel
data = {"general": []}

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "channels": list(data.keys())})

@app.post("/channels/{name}")
async def create_channel(name: str):
    if name not in data:
        data[name] = []
    return {"channels": list(data.keys())}

@app.get("/channels")
async def get_channels():
    return {"channels": list(data.keys())}

@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    await websocket.accept()
    if channel not in data:
        data[channel] = []
    try:
        while True:
            msg = await websocket.receive_text()
            data[channel].append(msg)
            await websocket.send_text("\n".join(data[channel]))
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
