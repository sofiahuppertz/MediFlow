import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Timer, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// --- Utility functions ---
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

interface Surgery {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed";
  progressStatus: "on-time" | "delayed" | "canceled";
  delayReason?: string;
  delayDuration?: number;
  timeType: "locked" | "estimated" | "dynamic";
  downstreamImpacts?: number;
}

const mockSurgeries: Surgery[] = [
  {
    id: "1",
    title: "Appendectomy",
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    progressStatus: "on-time",
    timeType: "dynamic",
  },
  {
    id: "2",
    title: "Hip Replacement",
    startTime: "11:00",
    endTime: "13:00",
    status: "in-progress",
    progressStatus: "delayed",
    delayReason: "Equipment setup",
    delayDuration: 30,
    timeType: "estimated",
    downstreamImpacts: 2,
  },
  {
    id: "3",
    title: "Cardiac Surgery",
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    progressStatus: "on-time",
    timeType: "locked",
  },
];

const DelayDialog = ({ surgery, onDelaySubmit }: { 
  surgery: Surgery, 
  onDelaySubmit: (id: string, delayMinutes: number, reason: string) => void 
}) => {
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please provide a reason for the delay",
        variant: "destructive",
      });
      return;
    }
    onDelaySubmit(surgery.id, delayMinutes, reason);
  };

  const currentEnd = timeToMinutes(surgery.endTime);
  const newEndTime = minutesToTime(currentEnd + delayMinutes);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Extend Surgery Duration</DialogTitle>
        <DialogDescription>
          Update the duration for {surgery.title}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="delay">Additional Time (minutes)</Label>
          <Input
            id="delay"
            type="number"
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            min={5}
            step={5}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reason">Reason for Extension</Label>
          <Input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Equipment setup"
          />
        </div>
        <div className="bg-muted p-3 rounded-md text-sm">
          <div className="mb-2">Timeline Preview:</div>
          <div className="text-muted-foreground">
            Original: {surgery.startTime} - {surgery.endTime}
          </div>
          <div className="text-primary">
            New: {surgery.startTime} - {newEndTime} (+{delayMinutes}m)
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          // Close dialog by clicking outside or pressing escape
        }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Confirm Extension
        </Button>
      </div>
    </DialogContent>
  );
};

const EmergencyDialog = ({ onSubmit, onClose }: { 
  onSubmit: (surgery: Omit<Surgery, 'id'>) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !startTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate end time based on start time and duration
    const startMinutes = timeToMinutes(startTime);
    const endTime = minutesToTime(startMinutes + duration);

    onSubmit({
      title,
      startTime,
      endTime,
      status: "scheduled",
      progressStatus: "on-time",
      timeType: "dynamic", // Emergency surgeries are dynamic by default
    });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Emergency Surgery</DialogTitle>
        <DialogDescription>
          Please provide details for the emergency procedure
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Surgery Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Emergency Appendectomy"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min="07:00"
            max="19:00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={15}
            step={15}
          />
        </div>
        <div className="bg-muted p-3 rounded-md text-sm">
          <div className="mb-2">Timeline Preview:</div>
          {startTime && (
            <div className="text-primary">
              {startTime} - {minutesToTime(timeToMinutes(startTime) + duration)}
              {' '}({duration}m)
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleSubmit}>
          Add Emergency Surgery
        </Button>
      </div>
    </DialogContent>
  );
};

const TimeSlot = ({ time, surgeries }: { time: string; surgeries: Surgery[] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find the surgery covering this time slot
  const surgery = surgeries.find((s) => {
    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(s.startTime);
    const endMinutes = timeToMinutes(s.endTime);
    const totalEndMinutes = endMinutes + (s.delayDuration || 0);
    return timeMinutes >= startMinutes && timeMinutes < totalEndMinutes;
  });

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

  const timeTypeStyles = {
    locked: "border-2",
    estimated: "border border-dashed",
    dynamic: "border border-dotted",
  };

  const isStartTime = surgery?.startTime === time;

  // Helper function to format duration (in minutes) into a human-readable string.
  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return `${minutes}min`;
  };

  const handleDelaySubmit = (id: string, delayMinutes: number, reason: string) => {
    if (surgery?.timeType === "locked") {
      toast({
        title: "Cannot Extend Locked Surgery",
        description: "This is a locked procedure. Please contact the chief surgeon.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Surgery Extended",
      description: `${surgery?.title} has been extended by ${delayMinutes} minutes`,
    });
    console.log(`Extending surgery ${id} by ${delayMinutes} minutes. Reason: ${reason}`);
  };

  if (!surgery) {
    return (
      <div className="relative grid grid-cols-[80px_1fr] gap-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">{time}</div>
        <div></div>
      </div>
    );
  }

  // Calculate the base duration in minutes (excluding any delay)
  const baseDuration = timeToMinutes(surgery.endTime) - timeToMinutes(surgery.startTime);
  // Optionally, if you want to include delay, you can do:
  const totalDuration = baseDuration + (surgery.delayDuration || 0);

  // Calculate how many 15-minute intervals the base surgery occupies.
  const baseSpan = Math.ceil(baseDuration / 15);
  // Calculate additional spans if a delay exists.
  const delaySpan = surgery.delayDuration ? Math.ceil(surgery.delayDuration / 15) : 0;
  const totalSpan = baseSpan + delaySpan;

  return (
    <div className="relative grid grid-cols-[80px_1fr] gap-4 py-2 border-t">
      <div className="text-sm text-muted-foreground">{time}</div>
      {isStartTime && (
        <div className="relative" style={{ gridRow: `span ${totalSpan}` }}>
          {/* Base Surgery Block */}
          <div
            className={cn(
              "rounded-t-lg px-4 py-3",
              statusColors[surgery.status],
              timeTypeStyles[surgery.timeType]
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-left font-medium hover:bg-transparent"
                    onClick={() => navigate(`/surgery/${surgery.id}`)}
                  >
                    {surgery.title}
                  </Button>
                  {surgery.timeType === "locked" && (
                    <span className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">🔒</span>
                  )}
                  {surgery.timeType === "estimated" && (
                    <span className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">⏳</span>
                  )}
                  {surgery.timeType === "dynamic" && (
                    <span className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">🌱</span>
                  )}
                </div>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    Extend
                  </Button>
                </DialogTrigger>
                <DelayDialog surgery={surgery} onDelaySubmit={handleDelaySubmit} />
              </Dialog>
            </div>
            <div className="text-sm">
              {formatDuration(baseDuration)}
            </div>
          </div>
          {/* Delay Block */}
          {delaySpan > 0 && (
            <div className="rounded-b-lg px-4 py-2 border-t border-dashed bg-red-100 text-red-700">
              <div className="text-sm">Delay: {surgery.delayReason}</div>
              <div className="text-sm">+{surgery.delayDuration} minutes</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Timesheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>(mockSurgeries);

  // Define the schedule start/end and dimensions for the calendar
  const scheduleStart = "07:00";
  const scheduleEnd = "19:00";
  const startMinutes = timeToMinutes(scheduleStart);
  const endMinutes = timeToMinutes(scheduleEnd);
  const totalMinutes = endMinutes - startMinutes;
  const hourHeight = 60; // 60 pixels per hour
  const calendarHeight = (totalMinutes / 60) * hourHeight;

  // Calculate current time offset for the indicator (only visible if within schedule)
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let currentOffset = -1;
  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
    currentOffset = ((nowMinutes - startMinutes) / 60) * hourHeight;
  }

  const handleEmergencySurgery = (newSurgery: Omit<Surgery, 'id'>) => {
    const surgeryToAdd: Surgery = {
      ...newSurgery,
      id: `emergency-${Date.now()}`, // Generate a unique ID
    };

    setSurgeries((prev) => [...prev, surgeryToAdd]);
    
    toast({
      title: "Emergency Surgery Added",
      description: "All relevant personnel have been notified.",
      variant: "destructive",
    });
    setShowEmergencyDialog(false);
  };

  return (
    <div className="layout-container max-w-4xl mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Surgery Schedule</h1>
      </div>

      {/* Calendar Container */}
      <Card className="p-6 relative" style={{ height: calendarHeight }}>
        {/* Hour Grid: Only hours are displayed */}
        {Array.from({ length: totalMinutes / 60 + 1 }, (_, i) => {
          const hourLabel =
            (i + timeToMinutes(scheduleStart) / 60).toString().padStart(2, "0") + ":00";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i * hourHeight,
                left: 0,
                right: 0,
                borderTop: "1px solid #e5e7eb",
              }}
            >
              {/* On mobile, use relative positioning with a left margin; on larger screens, use absolute positioning */}
              <span className="relative sm:absolute sm:-left-20 sm:ml-0 ml-2 text-sm text-gray-500">
                {hourLabel}
              </span>
            </div>
          );
        })}

        {/* Current Time Diagonal Indicator */}
        {currentOffset >= 0 && (
          <div
            style={{
              position: "absolute",
              top: currentOffset,
              left: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "red",
              transformOrigin: "left center",
              zIndex: 2,
            }}
          />
        )}

        {/* Surgery Blocks */}
        {surgeries.map((surgery) => {
          // Calculate the vertical position and height based on start time, end time, and delay
          const surgeryStartMins = timeToMinutes(surgery.startTime);
          const surgeryEndMins = timeToMinutes(surgery.endTime);
          const delayMins = surgery.delayDuration || 0;
          const baseHeight = ((surgeryEndMins - surgeryStartMins) / 60) * hourHeight;
          const delayHeight = (delayMins / 60) * hourHeight;
          const topOffset = ((surgeryStartMins - startMinutes) / 60) * hourHeight;

          // Styling based on surgery properties
          const statusColors = {
            scheduled: "bg-blue-100 text-blue-800 border-blue-200",
            "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
            completed: "bg-green-100 text-green-800 border-green-200",
          };

          const timeTypeStyles = {
            locked: "border-2",
            estimated: "border border-dashed",
            dynamic: "border border-dotted",
          };

          return (
            <div
              key={surgery.id}
              style={{
                position: "absolute",
                top: topOffset,
                left: 80, // Leave space for hour labels
                width: "calc(100% - 80px)",
                height: baseHeight + delayHeight,
                zIndex: 3,
              }}
            >
              {/* Base Surgery Block */}
              <div
                className={cn(
                  "rounded-t-lg px-4 py-3 relative",
                  statusColors[surgery.status],
                  timeTypeStyles[surgery.timeType]
                )}
                style={{ height: baseHeight }}
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
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <ArrowLeftRight className="h-4 w-4 mr-1" />
                        Extend
                      </Button>
                    </DialogTrigger>
                    <DelayDialog
                      surgery={surgery}
                      onDelaySubmit={(id, delay, reason) => {
                        toast({
                          title: "Surgery Extended",
                          description: `${surgery.title} extended by ${delay} minutes`,
                        });
                      }}
                    />
                  </Dialog>
                </div>
                <div className="text-sm">
                  {surgery.startTime} - {surgery.endTime}
                </div>
              </div>
              {/* Delay Block (if any) */}
              {delayMins > 0 && (
                <div
                  className="rounded-b-lg px-4 py-2 border-t border-dashed bg-red-100 text-red-700"
                  style={{ height: delayHeight }}
                >
                  <div className="text-sm">Delay: {surgery.delayReason}</div>
                  <div className="text-sm">+{surgery.delayDuration} minutes</div>
                </div>
              )}
              {/* {surgery.downstreamImpacts && surgery.downstreamImpacts > 0 && (
                <div className="mt-1 inline-flex items-center gap-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                  <AlertTriangle className="h-3 w-3" />
                  Affects {surgery.downstreamImpacts} later{" "}
                  {surgery.downstreamImpacts === 1 ? "surgery" : "surgeries"}
                </div>
              )} */}
            </div>
          );
        })}
      </Card>

      {/* Emergency Surgery Button */}
      <div className="fixed bottom-8 right-8 flex gap-4">
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="lg" className="shadow-lg">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </DialogTrigger>
          <EmergencyDialog onSubmit={handleEmergencySurgery} onClose={() => setShowEmergencyDialog(false)} />
        </Dialog>
      </div>
    </div>
  );
};

export default Timesheet;
