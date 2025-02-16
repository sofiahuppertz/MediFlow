import { useEffect, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addMinutesToTime } from "@/utils/timeUtils";
import { Surgery } from "@/types/Surgery";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

interface DelayDialogProps {
  surgery: Surgery;
  open: boolean;
  onDelaySubmit: (id: string, delayMinutes: number, reason: string) => void;
  onClose: () => void; // Function to close the dialog
  socket: WebSocket;
}
const DelayDialog = ({ surgery, open, onDelaySubmit, onClose, socket }: DelayDialogProps) => {
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  // Fetch delay prediction only when the dialog is opened
  useEffect(() => {
    console.log('open : ', open)
    if (open) {
      console.log('open')
      fetchDelayPrediction(surgery);
    }
  }, [open]);
  
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
    socket.send(
      JSON.stringify({
        "receiver": "patient",
        surgeryId: surgery.id,
        delayMinutes,
        reason,
      })
    );
    onClose(); // Close the dialog after submitting
  };

  const newEndTime = addMinutesToTime(surgery.endTime, delayMinutes);
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  // Fetch delay prediction when component mounts
  const fetchDelayPrediction = async (surgery) => {
    try {
      const response = await axios.get(process.env.API_URL + 'delay_prediction');
      console.log("Prediction response:", response);

      if (response.data) {
        // Convert hours to minutes
        const predictedDelayMinutes = parseFloat(response.data) * 60;
        // console.log('predicted : ',predictedDelayMinutes )
        // Convert surgery start time to minutes
        // console.log('surgery : ',surgery )
        const surgeryStartMinutes = timeToMinutes(surgery.startTime);
        const surgeryEndMinutes = timeToMinutes(surgery.endTime);

        // Calculate delta as an integer
        const delta = Math.round(surgeryEndMinutes - surgeryStartMinutes);
        console.log('delta (integer):', delta);

        // Calculate the difference as an integer
        const difference = Math.round(predictedDelayMinutes - delta);
        console.log('difference (integer):', difference);

        // Update the delay minutes state with integer value
        setDelayMinutes(difference);
        }
    } catch (error) {
      console.error("Failed to fetch delay prediction:", error);
      toast({
        title: "Prediction Error",
        description: "Failed to fetch delay prediction",
        variant: "destructive",
      });
    }
  };
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
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Confirm Extension
        </Button>
      </div>
    </DialogContent>
  );
};

export default DelayDialog;


