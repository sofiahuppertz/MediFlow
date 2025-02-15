from pydantic import EmailStr
from sqlmodel import Field, SQLModel

class Patient(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    date_of_birth: str
    phone: str
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    medicaments_current: str
    medicaments_anesthesie: str
    medicaments_conflicting: str


class Medicament(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)


class Surgery(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    surgery_name: str = Field(index=True, max_length=255)


class Staff(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    role: str = Field(max_length=255)


class Timesheet(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    patient_id: int
    surgery_id: int
    time_start: str
    time_end: str
    status_on_time: str
    status_ongoing: str
    staff_ids: str
    

        
