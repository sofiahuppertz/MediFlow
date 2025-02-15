import { useState } from "react";
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

const PatientPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  // Mock data
  const surgeryTime = "2025-02-25T14:30:00";
  const stopEatingTime = "2025-02-25T02:30:00"; // 12 hours before surgery
  const surgeryStatus = "on-time"; // could be 'on-time', 'delayed', or 'cancelled'
  const latestActions = [
    { id: 1, action: "Pre-surgery consultation completed", time: "2 hours ago" },
    { id: 2, action: "Blood work results received", time: "4 hours ago" },
    { id: 3, action: "Medication schedule updated", time: "1 day ago" },
  ];

  // Calculate time until surgery
  const calculateTimeUntil = () => {
    const surgery = new Date(surgeryTime);
    const now = new Date();
    const diff = surgery.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
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
          {/* Header section for patient info */}
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
            <p className="text-sm text-gray-500">Patient Dashboard</p>
          </header>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Surgery Details Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Scheduled Surgery</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Appendectomy</p>
              <p className="mt-1 text-gray-600">
                {new Date(surgeryTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </section>
            
            {/* Surgery Metrics & Status Section */}
            <aside className="bg-secondary/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-xs text-gray-400">Time until surgery</p>
                  <p className="text-lg font-semibold text-gray-900">{calculateTimeUntil()}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Info className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-xs text-gray-400">Surgery Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(surgeryTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <UtensilsCrossed className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-xs text-gray-400">Stop Eating &amp; Drinking</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(stopEatingTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={cn("text-lg font-semibold capitalize", getStatusColor(surgeryStatus))}>
                    {surgeryStatus}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Card>

        <Card className="p-6 animate-fade-up delay-100">
          <h3 className="text-lg font-medium mb-4">Latest Actions</h3>
          <div className="space-y-4">
            {latestActions.map((action) => (
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
                <p>Name: John Doe</p>
                <p>Patient ID: 123456</p>
                <p>Contact: (555) 123-4567</p>
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
