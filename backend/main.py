from typing import Annotated, List

from admin import setup_admin
from database import create_db_and_tables, get_session
from fastapi import Depends, FastAPI
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

@app.get("/patients/", response_model=List[Patient])
def read_patients(*, session: Session = Depends(get_session)):
    patients = session.exec(select(Patient)).all()
    return patients

@app.post("/patients/", response_model=Patient)
def create_patient(*, session: Session = Depends(get_session), patient: Patient):
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient

@app.get("/medicaments/", response_model=List[Medicament])
def read_medicaments(*, session: Session = Depends(get_session)):
    medicaments = session.exec(select(Medicament)).all()
    return medicaments

@app.post("/medicaments/", response_model=Medicament)
def create_medicament(*, session: Session = Depends(get_session), medicament: Medicament):
    session.add(medicament)
    session.commit()
    session.refresh(medicament)
    return medicament

@app.get("/surgeries/", response_model=List[Surgery])
def read_surgeries(*, session: Session = Depends(get_session)):
    surgeries = session.exec(select(Surgery)).all()
    return surgeries

@app.post("/surgeries/", response_model=Surgery)
def create_surgery(*, session: Session = Depends(get_session), surgery: Surgery):
    session.add(surgery)
    session.commit()
    session.refresh(surgery)
    return surgery

@app.get("/staff/", response_model=List[Staff])
def read_staff(*, session: Session = Depends(get_session)):
    staff = session.exec(select(Staff)).all()
    return staff

@app.post("/staff/", response_model=Staff)
def create_staff(*, session: Session = Depends(get_session), staff: Staff):
    session.add(staff)
    session.commit()
    session.refresh(staff)
    return staff

@app.get("/timesheets/", response_model=List[Timesheet])
def read_timesheets(*, session: Session = Depends(get_session)):
    timesheets = session.exec(select(Timesheet)).all()
    return timesheets

@app.post("/timesheets/", response_model=Timesheet)
def create_timesheet(*, session: Session = Depends(get_session), timesheet: Timesheet):
    session.add(timesheet)
    session.commit()
    session.refresh(timesheet)
    return timesheet
@app.websocket("/items/{item_id}/ws")
async def websocket_endpoint():
#  handle communication between the medical staff and the patient
    print("OK")