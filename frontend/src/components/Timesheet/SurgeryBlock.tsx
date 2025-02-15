import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeToMinutes } from "@/utils/timeUtils";
import { Surgery } from "@/types/Surgery";
import DelayDialog from "./DelayDialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

// const getTimeTypeEmoji = (dynamicStatus: string): string => {
//   if (dynamicStatus === "scheduled") return "🚧";
//   if (dynamicStatus === "estimated") return "🕒";
//   if (dynamicStatus === "dynamic") return "⚡️";
//   return "";
// };

interface SurgeryBlockProps {
  surgery: Surgery;
  scheduleStart: string;
  hourHeight: number;
  currentOffset: number;
  setSurgeries: (surgeries: Surgery[]) => void;
}

const SurgeryBlock = ({ surgery, scheduleStart, hourHeight, currentOffset, setSurgeries }: SurgeryBlockProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const surgeryStartMins = timeToMinutes(surgery.startTime);
  const surgeryEndMins = timeToMinutes(surgery.endTime);
  const delayMins = surgery.delayDuration || 0;
  const baseHeight = ((surgeryEndMins - surgeryStartMins) / 60) * hourHeight;
  const delayHeight = (delayMins / 60) * hourHeight;
  const startMinutes = timeToMinutes(scheduleStart);
  const topOffset = ((surgeryStartMins - startMinutes) / 60) * hourHeight;
  const bottomOffset = topOffset + baseHeight;
  const totalDuration = (surgeryEndMins - surgeryStartMins) + delayMins;

  let dynamicStatus = "scheduled";

  if (currentOffset >= topOffset && currentOffset <= bottomOffset) {
    dynamicStatus = "in-progress";
  } else if (currentOffset > bottomOffset) {
    dynamicStatus = "completed";
  }
  
  const updateSurgeries = async (newSurgery: Surgery) => {
    try {
      const response = await axios.post("http://localhost:8000/surgeries", newSurgery, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", response.data);
      setSurgeries(response.data);

    } catch (error) {
      console.error("Error updating surgeries:", error);
    }
  };

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

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours && minutes) return `${hours}h${minutes}`;
    return hours ? `${hours}h` : `${minutes}min`;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: topOffset,
        left: 80,
        width: "calc(100% - 80px)",
        height: baseHeight + delayHeight,
        zIndex: 0,
      }}
    >
      <div
        className={cn(
          "rounded-t-lg px-4 py-3 relative",
          statusColors[dynamicStatus],
          timeTypeStyles[surgery.timeType]
        )}
        style={{ height: baseHeight }}
      >
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              className="h-auto p-0 text-left font-medium hover:bg-transparent"
              onClick={() => navigate(`/surgery/${surgery.id}`)}
            >
              {surgery.title}
            </Button>
            <div className="text-sm">
              <Clock className="h-3 w-3 inline-block mr-1" />
              {formatDuration(totalDuration)}
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}> {/* Manage dialog open state */}
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border">
                <img src="/svg/delay.svg" alt="Delay Icon" className="w-6 h-6 opacity-75" />
              </Button>
            </DialogTrigger>
            <DelayDialog
              surgery={surgery}
              onDelaySubmit={(id, delay, reason) => {
                const updatedSurgery = { ...surgery, delayDuration: delay, delayReason: reason };
                updateSurgeries(updatedSurgery);
                toast({
                  title: "Surgery Extended",
                  description: `${surgery.title} extended by ${delay} minutes`,
                });
                setDialogOpen(false); // Close dialog after submission
              }}
              onClose={() => setDialogOpen(false)} // Close dialog on cancel
            />
          </Dialog>
        </div>
      </div>
      {delayMins > 0 && (
        <div
          className="flex items-center justify-between rounded-b-lg px-4 py-2 border-t border-dashed bg-red-100 text-red-700"
          style={{ height: delayHeight }}
        >
          <div className="text-sm font-bold">+{surgery.delayDuration} min Delay</div>
          <div className="text-sm">{surgery.delayReason}</div>
        </div>
      )}
    </div>
  );
};

export default SurgeryBlock;

