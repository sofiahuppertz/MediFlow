
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserRound, CalendarRange } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-container flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-8 animate-fade-up shadow-lg">
        <h1 className="text-3xl font-semibold text-center">Surgery Scheduler Hub</h1>
        <p className="text-muted-foreground text-center">
          Welcome to your medical management portal
        </p>
        
        <div className="grid gap-4 mt-8">
          <Button
            className="w-full h-16 text-lg transition-smooth hover:scale-[1.02]"
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
