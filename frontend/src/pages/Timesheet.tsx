import EmergencyDialog from "@/components/Timesheet/EmergencyDialog";
import SurgeryBlock from "@/components/Timesheet/SurgeryBlock";
import SurgeryRoomDropdown from "@/components/Timesheet/SurgeryRoomDropdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Surgery } from "@/types/Surgery";
import { timeToMinutes } from "@/utils/timeUtils";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { mockSurgeries } from "@/mocks/surgery_mock";

const Timesheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>(mockSurgeries);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws");
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);
      // Handle incoming data
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

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

    // Send a message to the WebSocket server
    // if (socketRef.current) {
    //   socketRef.current.send(JSON.stringify({ type: "emergency_surgery", data: surgeryToAdd }));
    // }

    setShowEmergencyDialog(false);
  };

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
  const currentOffset: number = 300;
  // if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
  //   currentOffset = ((nowMinutes - startMinutes) / 60) * hourHeight;
  // }

  
  useEffect(() => {
    axios.get("http://localhost:8000/surgeries")
      .then((response) => setSurgeries(response.data))
      .catch((error) => console.error("Error fetching surgeries:", error));
  }, []);

  return (
    <div className="layout-container max-w-4xl mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-[#0096C7]"
          >
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
            socket={socketRef.current}
            setSurgeries={setSurgeries}
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
