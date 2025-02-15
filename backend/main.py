import json
from typing import Annotated, List

from fastapi.responses import JSONResponse

from admin import setup_admin
from database import create_db_and_tables, get_session
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models import Medicament, Patient, Staff, Surgery, Timesheet
from sqlmodel import Session, select
from functions.inference_code import Inference
import json

SessionDep = Annotated[Session, Depends(get_session)]
SURGERIES_FILE = "mock_surgery.json"

# Load surgeries from a static JSON file
def load_surgeries():
    with open(SURGERIES_FILE, "r") as file:
        return json.load(file)
    

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

@app.get("/surgeries")
def read_surgeries():
    return load_surgeries()

def save_surgeries(updated_surgery):
    print('updated_surgery : ', updated_surgery)
    # Read the current surgeries from the file
    try:
        with open(SURGERIES_FILE, "r") as file:
            surgeries = json.load(file)
    except FileNotFoundError:
        # If the file doesn't exist, initialize an empty list
        surgeries = []
    
    # Find the surgery with the matching id and replace it
    for i, surgery in enumerate(surgeries):
        if surgery["id"] == updated_surgery[0]["id"]:
            surgeries[i] = updated_surgery[0]  # Replace the surgery
            break
    else:
        # If no matching surgery was found, you could optionally append the new surgery
        surgeries.append(updated_surgery[0])

    # Save the updated list back to the file
    with open(SURGERIES_FILE, "w") as file:
        json.dump(surgeries, file, indent=4)


@app.post("/surgeries")
def add_surgery(surgery: dict):
    surgeries = load_surgeries()
    surgeries.append(surgery)
    save_surgeries(surgeries)
    return surgeries

@app.get("/delay_prediction")
def inference_model():
    print("Call inference_model")
    inference = Inference()
    prediction = inference.main({})
    return prediction

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("websocket connected")
    await websocket.accept()
    initial_message = {"message": "Hello! This is a websocket server!"}
    await websocket.send_text(json.dumps(initial_message))

    try:
        while True:
            data = await websocket.receive_text()
            response = {"message": "Message received", "data": data}
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        print("websocket disconnected")