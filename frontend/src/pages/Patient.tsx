import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Clock,
  Info,
  History,
  AlertTriangle,
  ScrollText,
  UtensilsCrossed,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock patient data
const patientData = {
  id: "123456",
  name: "John Doe",
  age: 35,
  contact: "(555) 123-4567",
  email: "john.doe@example.com",
  surgery: {
    type: "Appendectomy",
    time: "2024-04-15T14:30:00",
    status: "on-time", // 'on-time', 'delayed', or 'cancelled'
    stopEatingTime: "2024-04-15T02:30:00"
  },
  latestActions: [
    { id: 1, action: "Pre-surgery consultation completed", time: "2 hours ago" },
    { id: 2, action: "Blood work results received", time: "4 hours ago" },
    { id: 3, action: "Medication schedule updated", time: "1 day ago" },
  ]
};

const PatientPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

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

  // Calculate time until surgery
  const calculateTimeUntil = () => {
    const surgery = new Date(patientData.surgery.time);
    const now = new Date();
    const diff = surgery.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "on-time":
        return "text-green-600";
      case "delayed":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="layout-container max-w-4xl mx-auto">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Patient Portal</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 animate-fade-up">
          <h2 className="text-xl font-medium mb-4">Welcome, {patientData.name}</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                Scheduled Surgery
              </div>
              <div className="font-medium">{patientData.surgery.type}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {new Date(patientData.surgery.time).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="flex-1 bg-secondary/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Time until surgery</div>
                  <div className="font-medium">{calculateTimeUntil()}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Surgery Time</div>
                  <div className="font-medium">
                    {new Date(patientData.surgery.time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Stop Eating & Drinking</div>
                  <div className="font-medium">
                    {new Date(patientData.surgery.stopEatingTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className={cn("font-medium capitalize", getStatusColor(patientData.surgery.status))}>
                    {patientData.surgery.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 animate-fade-up delay-100">
          <h3 className="text-lg font-medium mb-4">Latest Actions</h3>
          <div className="space-y-4">
            {patientData.latestActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg"
              >
                <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{action.action}</div>
                  <div className="text-sm text-muted-foreground">{action.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 animate-fade-up delay-200">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info">My Info</TabsTrigger>
              <TabsTrigger value="delay">Signal Delay</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4">
              <h4 className="font-medium">Personal Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Name: {patientData.name}</p>
                <p>Age: {patientData.age}</p>
                <p>Patient ID: {patientData.id}</p>
                <p>Contact: {patientData.contact}</p>
                <p>Email: {patientData.email}</p>
              </div>
            </TabsContent>
            <TabsContent value="delay" className="space-y-4">
              <h4 className="font-medium">Current Status</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>All systems operational</p>
                <p>No delays reported</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Button
          variant="link"
          className="text-muted-foreground hover:text-foreground transition-smooth"
          onClick={() => window.alert("Legal notice clicked")}
        >
          <ScrollText className="h-4 w-4 mr-2" />
          View Legal Notice
        </Button>
      </div>
    </div>
  );
};

export default PatientPage;