
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserRound, CalendarRange } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_VM_HTTP_URL; // Get API URL from .env
      
    const response = axios.get(`${apiUrl}/init`);
      
  });
  return (
    <div className="layout-container flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-8 animate-fade-up shadow-lg">
        <div className="flex items-center justify-center space-x-4">
          <img src="/images/logo.png" alt="Logo" className="size-12"/>
          <h1 className="text-5xl font-medium font-merriweather text-center">MediFlow</h1>
        </div>
        <p className="text-muted-foreground text-center">
          Welcome to your medical management portal
        </p>
        
        <div className="grid gap-4 mt-8">
          <Button
            variant="outline"
            className="w-full h-16 text-lg transition-smooth hover:scale-[1.02] bg-[#06BCDB] bg-opacity-50 hover:bg-[#06BCDB] hover:bg-opacity-75"
            onClick={() => navigate("/timesheet")}
          >
            <CalendarRange className="mr-2 h-5 w-5" />
            Medical Dashboard
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-16 text-lg transition-smooth hover:scale-[1.02]"
            onClick={() => navigate("/patient")}
          >
            <UserRound className="mr-2 h-5 w-5" />
            Patient Portal
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
