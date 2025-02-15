
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, UserRound, Stethoscope } from "lucide-react";

const mockSurgeryData = {
  "1": {
    id: "1",
    title: "Appendectomy",
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    patient: {
      name: "John Doe",
      age: 45,
      roomNumber: "OR-1",
    },
    surgeon: "Dr. Sarah Smith",
    notes: "Standard procedure, no complications expected",
  },
};

const Surgery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const surgery = mockSurgeryData[id as keyof typeof mockSurgeryData];

  if (!surgery) {
    return (
      <div className="layout-container">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Surgery not found</h1>
          <Button onClick={() => navigate("/timesheet")}>Return to Schedule</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container max-w-4xl mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" onClick={() => navigate("/timesheet")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Schedule
        </Button>
        <h1 className="text-2xl font-semibold">{surgery.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 animate-fade-up">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-medium">Surgery Details</h2>
          </div>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Time</dt>
              <dd className="font-medium">
                {surgery.startTime} - {surgery.endTime}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Room</dt>
              <dd className="font-medium">{surgery.patient.roomNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">{surgery.status}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 animate-fade-up delay-100">
          <div className="flex items-center mb-4">
            <UserRound className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-medium">Patient Information</h2>
          </div>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Name</dt>
              <dd className="font-medium">{surgery.patient.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Age</dt>
              <dd className="font-medium">{surgery.patient.age}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 md:col-span-2 animate-fade-up delay-200">
          <div className="flex items-center mb-4">
            <Stethoscope className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-medium">Medical Notes</h2>
          </div>
          <p className="text-muted-foreground">{surgery.notes}</p>
        </Card>
      </div>
    </div>
  );
};

export default Surgery;
