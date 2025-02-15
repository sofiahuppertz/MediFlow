from typing import Annotated

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.websocket("/items/{item_id}/ws")
async def websocket_endpoint():
#  handle communication between the medical staff and the patient
    pass