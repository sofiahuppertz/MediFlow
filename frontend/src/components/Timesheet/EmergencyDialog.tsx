import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addMinutesToTime } from "@/utils/timeUtils";
import { Surgery } from "@/types/Surgery";
import axios from "axios";

interface EmergencyDialogProps {
  onSubmit: (surgery: Omit<Surgery, "id">) => void;
  onClose: () => void;
}

const EmergencyDialog = ({ onSubmit, onClose }: EmergencyDialogProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title || !startTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    console.log('result : ' )

    const endTime = addMinutesToTime(startTime, duration);
    const newSurgery: Omit<Surgery, "id"> = {
      title,
      startTime,
      endTime,
      status: "scheduled",
      progressStatus: "on-time",
      timeType: "dynamic",
    };

    try {
      const apiUrl = import.meta.env.VITE_VM_HTTP_URL; // Get API URL from .env
      await axios.post(`${apiUrl}/surgeries`, newSurgery, {
        headers: { "Content-Type": "application/json" },
      });
      console.log('result : ',newSurgery )
      onSubmit(newSurgery);
      window.location.reload();
    } catch (error) {
      console.error("Error updating surgeries:", error);
    }
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
              {startTime} - {addMinutesToTime(startTime, duration)} ({duration}m)
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

export default EmergencyDialog;