# filepath: /Users/sofiahuppertz/MediFlow/backend/admin.py
from sqladmin import Admin, ModelView
from sqlmodel import Session

from database import engine
from models import Patient, Drug, Surgery, Staff, Timesheet, Action

class PatientAdmin(ModelView, model=Patient):
    column_list = [Patient.id, Patient.name, Patient.date_of_birth, Patient.phone, Patient.email, Patient.medicaments_current, Patient.medicaments_anesthesie, Patient.medicaments_conflicting, Patient.age, Patient.height, Patient.weight]

class MedicamentAdmin(ModelView, model=Drug):
    column_list = [Drug.id, Drug.name]

class SurgeryAdmin(ModelView, model=Surgery):
    column_list = [Surgery.id, Surgery.surgery_name]

class StaffAdmin(ModelView, model=Staff):
    column_list = [Staff.id, Staff.name, Staff.role]

class TimesheetAdmin(ModelView, model=Timesheet):
    column_list = [Timesheet.id, Timesheet.patient_id, Timesheet.surgery_id, Timesheet.time_start, Timesheet.time_end]

class ActionAdmin(ModelView, model=Action):
    column_list = [Action.id, Action.patient_id, Action.surgery_id, Action.message, Action.time, Action.patient_understood]

def setup_admin(app):
    admin = Admin(app, engine)
    admin.add_view(PatientAdmin)
    admin.add_view(MedicamentAdmin)
    admin.add_view(SurgeryAdmin)
    admin.add_view(StaffAdmin)
    admin.add_view(TimesheetAdmin)