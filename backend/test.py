from main import save_surgeries


new_surgery = [{
    "id": "1",
    "title": "Appendectomy",
    "startTime": "08:00",
    "endTime": "14:30",
    "delayDuration": 15,
    "delayReason": "Equipment setup"
}]

save_surgeries(new_surgery)
