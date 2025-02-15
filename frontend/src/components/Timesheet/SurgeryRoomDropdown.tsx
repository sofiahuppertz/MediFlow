import { useState } from "react";
import { Label } from "@/components/ui/label";

const SurgeryRoomDropdown = () => {
  const [selectedRoom, setSelectedRoom] = useState("Main OR");
  const rooms = ["Main OR", "Secondary OR", "Ambulatory OR"];

  return (
    <div className="mb-4">
      <Label htmlFor="surgery-room" className="block text-sm font-medium text-muted-foreground">
        Surgery Room
      </Label>
      <select
        id="surgery-room"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
        className="mt-1 block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {rooms.map((room) => (
          <option key={room} value={room}>
            {room}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SurgeryRoomDropdown;