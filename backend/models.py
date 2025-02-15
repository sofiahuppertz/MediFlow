from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from pydantic import EmailStr
from sqlmodel import Field, SQLModel, Relationship
from typing import List, Optional

from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr

class Drug(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)

class DrugInteraction(SQLModel, table=True):
    drug1_id: int = Field(foreign_key="drug.id", primary_key=True)
    drug2_id: int = Field(foreign_key="drug.id", primary_key=True)
    interaction_description: str
    interaction_ok: bool

class PatientDrugsTakingLink(SQLModel, table=True):
    patient_id: int = Field(foreign_key="patient.id", primary_key=True)
    drug_id: int = Field(foreign_key="drug.id", primary_key=True)

class PatientDrugsAnesthesiaLink(SQLModel, table=True):
    patient_id: int = Field(foreign_key="patient.id", primary_key=True)
    drug_id: int = Field(foreign_key="drug.id", primary_key=True)

class PatientDrugsNotToTakeOnOperationDayLink(SQLModel, table=True):
    patient_id: int = Field(foreign_key="patient.id", primary_key=True)
    drug_id: int = Field(foreign_key="drug.id", primary_key=True)

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    date_of_birth: str
    phone: str
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    age: int
    height: float
    weight: float
    sex: str

    drugs_taking: List["Drug"] = Relationship(link_model=PatientDrugsTakingLink)
    drugs_anesthesia: List["Drug"] = Relationship(link_model=PatientDrugsAnesthesiaLink)
    drugs_not_to_take_on_operation_day: List["Drug"] = Relationship(link_model=PatientDrugsNotToTakeOnOperationDayLink)

    actions: List["Action"] = Relationship(back_populates="patient")
    surgeries: List["Surgery"] = Relationship(back_populates="patient")

class Action(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    message: str
    time: str
    patient_understood: bool
    
    patient_id: int = Field(foreign_key="patient.id")
    surgery_id: int = Field(foreign_key="surgery.id")

    patient: Optional[Patient] = Relationship(back_populates="actions")
    surgery: Optional["Surgery"] = Relationship(back_populates="actions")

class SurgeryStaffLink(SQLModel, table=True):
    surgery_id: int = Field(foreign_key="surgery.id", primary_key=True)
    staff_id: int = Field(foreign_key="staff.id", primary_key=True)


class Surgery(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    surgery_name: str = Field(index=True, max_length=255)
    start_time: str
    end_time: str
    status: str
    
    patient_id: int = Field(foreign_key="patient.id")
    timesheet_id: int = Field(foreign_key="timesheet.id")
    
    staffs: List["Staff"] = Relationship(back_populates="surgeries", link_model=SurgeryStaffLink)
    actions: List[Action] = Relationship(back_populates="surgery")
    timesheet: Optional["Timesheet"] = Relationship(back_populates="surgeries")
    patient: Optional[Patient] = Relationship(back_populates="surgeries")


class Staff(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    role: str = Field(max_length=255)
    
    surgeries: List[Surgery] = Relationship(back_populates="staffs", link_model=SurgeryStaffLink)



class Timesheet(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    surgeries: List[Surgery] = Relationship(back_populates="timesheet")
