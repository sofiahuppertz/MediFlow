import json
from typing import Annotated, List

from fastapi.responses import JSONResponse

from admin import setup_admin
from database import create_db_and_tables, get_session
from fastapi import Depends, FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from models import Medicament, Patient, Staff, Surgery, Timesheet
from sqlmodel import Session, select

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
  create_db_and_tables()
  setup_admin(app)
  

@app.get("/get_patient_data")
async def get_patient_data():
    patient_data = {
        "id": "123456",
        "name": "John Doe",
        "age": 35,
        "contact": "(555) 123-4567",
        "email": "john.doe@example.com",
        "surgery": {
            "type": "Appendectomy",
            "time": "2024-04-15T14:30:00",
            "status": "on-time",  # 'on-time', 'delayed', or 'cancelled'
            "stopEatingTime": "2024-04-15T02:30:00"
        },
        "latestActions": [
            {"id": 1, "action": "Pre-surgery consultation completed", "time": "2 hours ago"},
            {"id": 2, "action": "Blood work results received", "time": "4 hours ago"},
            {"id": 3, "action": "Medication schedule updated", "time": "1 day ago"}
        ]
    }
    print(patient_data)
    return JSONResponse(content=patient_data)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("websocket connected")
    await websocket.accept()
    # Send a JSON message on connection
    initial_message = {"message": "Hello! This is a websocket server!"}
    await websocket.send_text(json.dumps(initial_message))
    while True:
        data = await websocket.receive_text()
        response = {"message": "Message received", "data": data}
        await websocket.send_text(json.dumps(response))


 