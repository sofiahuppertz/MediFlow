# filepath: /Users/sofiahuppertz/MediFlow/backend/admin.py
from sqladmin import Admin, ModelView
from sqlmodel import Session

from database import engine
from models import (
    Action,
    Drug,
    DrugInteraction,
    Patient,
    PatientDrugsTakingLink,
    PatientDrugsAnesthesiaLink,
    PatientDrugsNotToTakeOnOperationDayLink,
    Staff,
    Surgery,
    Timesheet,
)

class PatientAdmin(ModelView, model=Patient):
    column_list = [
        Patient.id,
        Patient.name,
        Patient.date_of_birth,
        Patient.phone,
        Patient.email,
        Patient.age,
        Patient.height,
        Patient.weight,
        Patient.sex,
    ]

class DrugAdmin(ModelView, model=Drug):
    column_list = [Drug.id, Drug.name]

class DrugInteractionAdmin(ModelView, model=DrugInteraction):
    column_list = [
        DrugInteraction.drug1_id,
        DrugInteraction.drug2_id,
        DrugInteraction.interaction_description,
        DrugInteraction.interaction_ok,
    ]

class PatientDrugsTakingLinkAdmin(ModelView, model=PatientDrugsTakingLink):
    column_list = [PatientDrugsTakingLink.patient_id, PatientDrugsTakingLink.drug_id]

class PatientDrugsAnesthesiaLinkAdmin(ModelView, model=PatientDrugsAnesthesiaLink):
    column_list = [PatientDrugsAnesthesiaLink.patient_id, PatientDrugsAnesthesiaLink.drug_id]

class PatientDrugsNotToTakeOnOperationDayLinkAdmin(ModelView, model=PatientDrugsNotToTakeOnOperationDayLink):
    column_list = [
        PatientDrugsNotToTakeOnOperationDayLink.patient_id,
        PatientDrugsNotToTakeOnOperationDayLink.drug_id,
    ]

class ActionAdmin(ModelView, model=Action):
    column_list = [
        Action.id,
        Action.message,
        Action.time,
        Action.patient_understood,
        Action.patient_id,
        Action.surgery_id,
    ]

class SurgeryAdmin(ModelView, model=Surgery):
    column_list = [
        Surgery.id,
        Surgery.surgery_name,
        Surgery.start_time,
        Surgery.end_time,
        Surgery.status,
        Surgery.staff_ids,
        Surgery.patient_id,
        Surgery.timesheet_id,
    ]

class StaffAdmin(ModelView, model=Staff):
    column_list = [Staff.id, Staff.name, Staff.role]

class TimesheetAdmin(ModelView, model=Timesheet):
    column_list = [Timesheet.id]
    
def setup_admin(app):
    admin = Admin(app, engine)
    admin.add_view(PatientAdmin)
    admin.add_view(DrugAdmin)
    admin.add_view(DrugInteractionAdmin)
    admin.add_view(PatientDrugsTakingLinkAdmin)
    admin.add_view(PatientDrugsAnesthesiaLinkAdmin)
    admin.add_view(PatientDrugsNotToTakeOnOperationDayLinkAdmin)
    admin.add_view(ActionAdmin)
    admin.add_view(SurgeryAdmin)
    admin.add_view(StaffAdmin)
    admin.add_view(TimesheetAdmin)