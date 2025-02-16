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
from datetime import datetime, timedelta
import os

SessionDep = Annotated[Session, Depends(get_session)]
SURGERIES_FILE = "mock_surgery.json"


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
        "medicaments":
            [
                {"name": "Pyridostigmine", "dose": "60mg", "frequency": "every 8 hours"},
                {"name": "Prednisone", "dose": "5mg", "frequency": "every 12 hours"},
            ],
        "surgery": {
            "type": "Appendectomy",
            "time": "2025-02-16T14:30:00",
            "status": "on-time",  # 'on-time', 'delayed', or 'cancelled'
        },
        "latestActions": [
            {"id": 1, "action": "Remember not to take  Pyridostigmine", "time": "8 hours ago"},
            {"id": 2, "action": "Pre-surgery consultation completed", "time": "2 days ago"},
        ]
    }
    return JSONResponse(content=patient_data)
def load_surgeries():
    with open(SURGERIES_FILE, "r") as file:
        return json.load(file)

def add_minutes(time_str, minutes_to_add):
    hours, minutes = map(int, time_str.split(":"))
    total = hours * 60 + minutes + minutes_to_add
    new_hours = (total // 60) % 24
    new_minutes = total % 60
    return f"{new_hours:02d}:{new_minutes:02d}"

def to_minutes(time_str):
    h, m = map(int, time_str.split(":"))
    return h * 60 + m

from datetime import datetime, timedelta
import json

def consistency():
    def adjust_schedule(operations):
        fmt = "%H:%M"

        # Sort operations by start time to handle unordered inputs
        operations.sort(key=lambda x: datetime.strptime(x['startTime'], fmt))

        for i in range(len(operations) - 1):
            current_end = datetime.strptime(operations[i]['endTime'], fmt)
            if 'delayDuration' in operations[i]:
                current_end += timedelta(minutes=operations[i]['delayDuration'])
            next_start = datetime.strptime(operations[i + 1]['startTime'], fmt)

            # Check if the next operation starts before the current one ends
            if current_end >= next_start:
                # Shift the next operation by 10 minutes
                new_start = current_end + timedelta(minutes=10)
                duration = datetime.strptime(operations[i + 1]['endTime'], fmt) - datetime.strptime(operations[i + 1]['startTime'], fmt)
                new_end = new_start + duration

                # Update the next operation's start and end times
                operations[i + 1]['startTime'] = new_start.strftime(fmt)
                operations[i + 1]['endTime'] = new_end.strftime(fmt)

            return operations


    # Load operations from JSON file
    with open('mock_surgery.json', 'r') as file:
        operations = json.load(file)

    # Adjust the schedule
    adjusted_operations = adjust_schedule(operations)

    # Save the updated operations back to the JSON file
    with open('mock_surgery.json', 'w') as file:
        json.dump(adjusted_operations, file, indent=4)

    print("Operations schedule updated successfully.")

def save_surgeries(updated_surgery):
    surgeries = load_surgeries()
    
    # Update the existing surgery or add a new one
    updated = False
    for i, surgery in enumerate(surgeries):
        if surgery["id"] == updated_surgery["id"]:
            # Sum the previous delay and the new delay (defaulting to 0 if not present)
            existing_delay = surgery.get("delayDuration", 0)
            new_delay = updated_surgery.get("delayDuration", 0)
            updated_surgery["new_delay"] = new_delay
            total_delay = existing_delay + new_delay

            # Update the delayDuration in the new surgery with the total delay
            updated_surgery["delayDuration"] = total_delay

            surgeries[i] = updated_surgery
            updated = True
            break

    if not updated:
        surgeries.append(updated_surgery)

    # Sort by original startTime
    surgeries.sort(key=lambda s: to_minutes(s["startTime"]))

    # Apply cumulative delay
    cumulative_delay = 0
    for surgery in surgeries:
        # Apply previous cumulative delay to this surgery
        if cumulative_delay > 0:
            print(cumulative_delay)
            print(surgery["title"])
            surgery["startTime"] = add_minutes(surgery["startTime"], cumulative_delay)
            surgery["endTime"] = add_minutes(surgery["endTime"], cumulative_delay)

        
        # Add this surgery's delay to the cumulative delay
        if surgery.get("new_delay", 0) > 0:
            cumulative_delay += surgery["new_delay"]

    with open(SURGERIES_FILE, "w") as file:
        json.dump(surgeries, file, indent=4)
    return surgeries

@app.post("/surgeries")
def update_surgery(surgery: dict):
    updated_surgeries = save_surgeries(surgery)
    return updated_surgeries

@app.get("/surgeries")
def read_surgeries():
    return load_surgeries()

@app.get("/delay_prediction")
def inference_model():
    print("Call inference_model")
    inference = Inference()
    prediction = inference.main({})
    return prediction

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()
 
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        welcome = {"message": "Hello! This is a websocket server!"}
        await websocket.send_text(json.dumps(welcome))
        while True:
            data = await websocket.receive_text()
            print("Received data:", data)
            # response = {"message": "Message received", "data": data}
            await manager.broadcast(json.dumps(data))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("WebSocket disconnected")
