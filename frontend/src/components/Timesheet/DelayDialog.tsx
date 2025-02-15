import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addMinutesToTime } from "@/utils/timeUtils";
import { Surgery } from "@/types/Surgery";

interface DelayDialogProps {
  surgery: Surgery;
  onDelaySubmit: (id: string, delayMinutes: number, reason: string) => void;
}

const DelayDialog = ({ surgery, onDelaySubmit }: DelayDialogProps) => {
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

  const newEndTime = addMinutesToTime(surgery.endTime, delayMinutes);

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
        <Button variant="outline" onClick={() => {}}>
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