from typing import Annotated, List

from admin import setup_admin
from database import create_db_and_tables, get_session
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Medicament, Patient, Staff, Surgery, Timesheet
from sqlmodel import Session, select
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

@app.get("/")
def read_root():
    return {"Hello": "World"}

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

@app.websocket("/items/{item_id}/ws")
async def websocket_endpoint():
#  handle communication between the medical staff and the patient
    print("OK")