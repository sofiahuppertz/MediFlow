
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Timer, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Surgery {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  progressStatus: "on-time" | "delayed" | "canceled";
}

const mockSurgeries: Surgery[] = [
  {
    id: "1",
    title: "Appendectomy",
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    progressStatus: "on-time",
  },
  {
    id: "2",
    title: "Hip Replacement",
    startTime: "11:00",
    endTime: "13:00",
    status: "in-progress",
    progressStatus: "delayed",
  },
  {
    id: "3",
    title: "Cataract Surgery",
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
    progressStatus: "on-time",
  },
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const TimeSlot = ({ time, surgeries }: { time: string; surgeries: Surgery[] }) => {
  const navigate = useNavigate();
  const surgery = surgeries.find(
    (s) => {
      const timeMinutes = timeToMinutes(time);
      const startMinutes = timeToMinutes(s.startTime);
      const endMinutes = timeToMinutes(s.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    }
  );

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  };

  const progressStatusColors = {
    "on-time": "text-green-600",
    delayed: "text-yellow-600",
    canceled: "text-red-600",
  };

  const isStartTime = surgery?.startTime === time;

  const handleExtendPeriod = (surgeryId: string, newDuration: number) => {
    // In a real app, this would update the backend
    console.log(`Extending surgery ${surgeryId} by ${newDuration} hours`);
  };

  return (
    <div className="relative grid grid-cols-[80px_1fr] gap-4 py-2 border-t">
      <div className="text-sm text-muted-foreground">{time}</div>
      {surgery && isStartTime && (
        <div
          className={cn(
            "rounded-lg border px-4 py-3",
            statusColors[surgery.status]
          )}
          style={{
            gridRow: `span ${
              Math.ceil((timeToMinutes(surgery.endTime) - timeToMinutes(surgery.startTime)) / 15)
            }`,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <Button
                variant="ghost"
                className="h-auto p-0 text-left font-medium hover:bg-transparent"
                onClick={() => navigate(`/surgery/${surgery.id}`)}
              >
                {surgery.title}
              </Button>
              <div
                className={cn(
                  "text-sm mt-1 flex items-center gap-2",
                  progressStatusColors[surgery.progressStatus]
                )}
              >
                <Timer className="h-3 w-3" />
                {surgery.progressStatus}
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-dashed"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-1" />
                  Extend
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-3">
                  <h4 className="font-medium">Adjust Duration</h4>
                  <div className="flex flex-col gap-2">
                    {[2, 4, 6, 8].map((hours) => (
                      <Button
                        key={hours}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleExtendPeriod(surgery.id, hours)}
                      >
                        {hours} hours
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-sm mt-2">
            {surgery.startTime} - {surgery.endTime}
          </div>
        </div>
      )}
    </div>
  );
};

const Timesheet = () => {
  const navigate = useNavigate();
  const hours = Array.from({ length: 13 }, (_, i) => i + 7);

  return (
    <div className="layout-container max-w-4xl mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Surgery Schedule</h1>
      </div>

      <Card className="p-6 animate-fade-up">
        <div className="flex items-center mb-6">
          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-lg font-medium">Today's Schedule</h2>
        </div>

        <div className="space-y-1">
          {hours.map((hour) =>
            ["00", "15", "30", "45"].map((minute) => (
              <TimeSlot
                key={`${hour}:${minute}`}
                time={`${hour.toString().padStart(2, "0")}:${minute}`}
                surgeries={mockSurgeries}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Timesheet;
