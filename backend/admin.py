# filepath: /Users/sofiahuppertz/MediFlow/backend/admin.py
from sqladmin import Admin, ModelView
from sqlmodel import Session

from database import engine
from models import Patient, Medicament, Surgery, Staff, Timesheet

class PatientAdmin(ModelView, model=Patient):
    column_list = [Patient.id, Patient.name, Patient.email]

class MedicamentAdmin(ModelView, model=Medicament):
    column_list = [Medicament.id, Medicament.name]

class SurgeryAdmin(ModelView, model=Surgery):
    column_list = [Surgery.id, Surgery.surgery_name]

class StaffAdmin(ModelView, model=Staff):
    column_list = [Staff.id, Staff.name, Staff.role]

class TimesheetAdmin(ModelView, model=Timesheet):
    column_list = [Timesheet.id, Timesheet.patient_id, Timesheet.surgery_id, Timesheet.time_start, Timesheet.time_end]

def setup_admin(app):
    admin = Admin(app, engine)
    admin.add_view(PatientAdmin)
    admin.add_view(MedicamentAdmin)
    admin.add_view(SurgeryAdmin)
    admin.add_view(StaffAdmin)
    admin.add_view(TimesheetAdmin)