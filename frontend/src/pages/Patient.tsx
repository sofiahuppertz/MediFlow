import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  AlertTriangle,
  ChevronLeft,
  Clock,
  History,
  Info,
  ScrollText,
  UtensilsCrossed,
  MilkOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Palette constants
const palette = {
  brightCyan: "#06BCDB",
  deepNavy: "#1A446D",
  electricBlue: "#0096C7",
  softTeal: "#80E1D1",
  lightMist: "#E3F8FF",
  warmCoral: "#FF6B6B",
  sunsetOrange: "#FF8E72",
  softLavender: "#B39CD0",
  deepIndigo: "#4B0082",
  mutedGold: "#E5C07B",
};

const PatientPage = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get_patient_data");
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, []);

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

  if (!patientData)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading patient data...
      </div>
    );

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "on-time":
        return { color: palette.electricBlue };
      case "delayed":
        return { color: palette.sunsetOrange };
      case "cancelled":
        return { color: palette.warmCoral };
      default:
        return { color: palette.deepNavy };
    }
  };

  const surgeryTime = new Date(patientData.surgery.time);
  const stopEatingTime = new Date(surgeryTime.getTime() - 6 * 60 * 60 * 1000);
  const stopDrinkingTime = new Date(surgeryTime.getTime() - 2 * 60 * 60 * 1000);

  return (
    <div
      className="layout-container max-w-4xl mx-auto p-6"
      style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fff" }}
    >
      <div
        className="flex items-center mb-8 space-x-4 border-b pb-4"
        style={{ borderColor: palette.lightMist }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-[#0096C7]"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1
          className="text-2xl font-semibold font-merriweather"
          style={{ color: palette.deepNavy }}
        >
          Patient Portal
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Patient Info Card */}
        <Card
          className="p-6 animate-fade-up shadow-sm rounded-lg"
          style={{
            backgroundColor: "#fff",
            border: `1px solid ${palette.lightMist}`,
          }}
        >
          <h2
            className="text-xl font-medium mb-4 font-merriweather"
            style={{ color: palette.deepNavy }}
          >
            Welcome, {patientData.name}
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div
                className="text-sm mb-1"
                style={{ color: palette.deepNavy, opacity: 0.7 }}
              >
                Scheduled Surgery
              </div>
              <div
                className="font-medium text-lg"
                style={{ color: palette.electricBlue }}
              >
                {patientData.surgery.type}
              </div>
              <div
                className="text-sm mt-2"
                style={{ color: palette.deepNavy, opacity: 0.7 }}
              >
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
            <div className="flex-1 p-4 rounded-lg space-y-3" style={{ backgroundColor: palette.lightMist }}>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" style={{ color: palette.deepNavy }} />
                <div>
                  <div className="text-sm" style={{ color: palette.deepNavy, opacity: 0.7 }}>Time until surgery</div>
                  <div className="font-medium" style={{ color: palette.deepNavy }}>{calculateTimeUntil()}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5" style={{ color: palette.deepNavy }} />
                <div>
                  <div className="text-sm" style={{ color: palette.deepNavy, opacity: 0.7 }}>Surgery Time</div>
                  <div className="font-medium" style={{ color: palette.deepNavy }}>
                    {surgeryTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5" style={{ color: palette.deepNavy }} />
                <div>
                  <div className="text-sm" style={{ color: palette.deepNavy, opacity: 0.7 }}>Stop Eating</div>
                  <div className="font-medium" style={{ color: palette.deepNavy }}>
                    {stopEatingTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MilkOff className="h-5 w-5" style={{ color: palette.deepNavy }} />
                <div>
                  <div className="text-sm" style={{ color: palette.deepNavy, opacity: 0.7 }}>Stop Drinking</div>
                  <div className="font-medium" style={{ color: palette.deepNavy }}>
                    {stopDrinkingTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" style={{ color: palette.deepNavy }} />
                <div>
                  <div className="text-sm" style={{ color: palette.deepNavy, opacity: 0.7 }}>Status</div>
                  <div className="font-medium capitalize" style={getStatusStyle(patientData.surgery.status)}>
                    {patientData.surgery.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Latest Actions Card */}
        <Card
          className="p-6 animate-fade-up delay-100 shadow-sm rounded-lg"
          style={{
            backgroundColor: "#fff",
            border: `1px solid ${palette.lightMist}`,
          }}
        >
          <h3
            className="text-lg font-medium mb-4 font-merriweather"
            style={{ color: palette.deepNavy }}
          >
            Latest Actions
          </h3>
          <div className="space-y-4">
            {patientData.latestActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start space-x-3 p-3 rounded-lg"
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${palette.lightMist}`,
                }}
              >
                <History
                  className="h-5 w-5 mt-0.5"
                  style={{ color: palette.deepNavy }}
                />
                <div>
                  <div className="font-medium" style={{ color: palette.deepNavy }}>
                    {action.action}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: palette.deepNavy, opacity: 0.7 }}
                  >
                    {action.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs Card */}
        <Card
          className="p-6 animate-fade-up delay-200 shadow-sm rounded-lg"
          style={{
            backgroundColor: "#fff",
            border: `1px solid ${palette.lightMist}`,
          }}
        >
          <Tabs defaultValue="info" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2 mb-6"
              style={{ borderBottom: `1px solid ${palette.lightMist}` }}
            >
              <TabsTrigger
                value="info"
                className="px-4 py-2 font-medium transition-colors"
                style={{ color: palette.deepNavy }}
              >
                My Info
              </TabsTrigger>
              <TabsTrigger
                value="delay"
                className="px-4 py-2 font-medium transition-colors"
                style={{ color: palette.deepNavy }}
              >
                Signal Delay
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4">
              <h4
                className="font-medium font-merriweather"
                style={{ color: palette.deepNavy }}
              >
                Personal Information
              </h4>
              <div
                className="space-y-2 text-sm"
                style={{ color: palette.deepNavy, opacity: 0.8 }}
              >
                <p>Name: {patientData.name}</p>
                <p>Age: {patientData.age}</p>
                <p>Patient ID: {patientData.id}</p>
                <p>Contact: {patientData.contact}</p>
                <p>Email: {patientData.email}</p>
              </div>
            </TabsContent>
            <TabsContent value="delay" className="space-y-4">
              <h4
                className="font-medium font-merriweather"
                style={{ color: palette.deepNavy }}
              >
                Current Status
              </h4>
              <div
                className="space-y-2 text-sm"
                style={{ color: palette.deepNavy, opacity: 0.8 }}
              >
                <p>All systems operational</p>
                <p>No delays reported</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Button
          variant="link"
          className="flex items-center text-[#1A446D] hover:text-[#0096C7] transition-colors"
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
