import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { timeToMinutes } from "@/utils/timeUtils";
import DelayDialog from "@/components/Timesheet/DelayDialog";
import EmergencyDialog from "@/components/Timesheet/EmergencyDialog";
import SurgeryRoomDropdown from "@/components/Timesheet/SurgeryRoomDropdown";
import SurgeryBlock from "@/components/Timesheet/SurgeryBlock";
import { useToast } from "@/components/ui/use-toast";
import { Surgery } from "@/types/Surgery";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Sample surgeries array (could also be moved to a separate file)
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
  {
    id: "4",
    title: "Feet Surgery",
    startTime: "17:00",
    endTime: "18:00",
    status: "scheduled",
    progressStatus: "on-time",
    timeType: "locked",
  },
];

const Timesheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>(mockSurgeries);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calendar configuration
  const scheduleStart = "07:00";
  const scheduleEnd = "19:00";
  const startMinutes = timeToMinutes(scheduleStart);
  const endMinutes = timeToMinutes(scheduleEnd);
  const totalMinutes = endMinutes - startMinutes;
  const hourHeight = 60;
  const calendarHeight = (totalMinutes / 60) * hourHeight;

  // Current time indicator calculation
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const currentOffset: number = 450;
  // if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
  //   currentOffset = ((nowMinutes - startMinutes) / 60) * hourHeight;
  // }

  const handleEmergencySurgery = (newSurgery: Omit<Surgery, "id">) => {
    const surgeryToAdd: Surgery = {
      ...newSurgery,
      id: `emergency-${Date.now()}`,
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
        <div>
          <h1 className="text-2xl font-semibold">Surgery Schedule</h1>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
      </div>

      <SurgeryRoomDropdown />

      <Card className="p-6 relative" style={{ height: calendarHeight }}>
        {/* Hour Grid */}
        {Array.from({ length: totalMinutes / 60 + 1 }, (_, i) => {
          const hourLabel = `${(i + timeToMinutes(scheduleStart) / 60)
            .toString()
            .padStart(2, "0")}:00`;
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
              <span className="relative sm:absolute sm:-left-20 sm:ml-0 ml-2 text-sm text-gray-500">
                {hourLabel}
              </span>
            </div>
          );
        })}

        {/* Current Time Indicator */}
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
        {surgeries.map((surgery) => (
          <SurgeryBlock
            key={surgery.id}
            surgery={surgery}
            scheduleStart={scheduleStart}
            hourHeight={hourHeight}
            currentOffset={currentOffset}
          />
        ))}
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
          <EmergencyDialog
            onSubmit={handleEmergencySurgery}
            onClose={() => setShowEmergencyDialog(false)}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Timesheet;
