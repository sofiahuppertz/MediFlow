from typing import Annotated, List

# from admin import setup_admin
from database import create_db_and_tables, get_session
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Drug, Patient, Staff, Surgery, Timesheet
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
  # setup_admin(app)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.websocket("/items/{item_id}/ws")
async def websocket_endpoint():
#  handle communication between the medical staff and the patient
    print("OK")