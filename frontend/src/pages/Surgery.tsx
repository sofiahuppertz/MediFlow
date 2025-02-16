import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, UserRound, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

const mockSurgeryData = {
  "1": {
    id: "1",
    title: "Appendectomy",
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    patient: {
      name: "John Doe",
      age: 45,
      roomNumber: "OR-1",
    },
    surgeon: "Dr. Sarah Smith",
    notes: "⚠️ Patient takes  Pyridostigmine (for myasthenia gravis). Pyridostigmine might make the Succinylcholine last longer, which could cause breathing problems.",
  },
};

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const Surgery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const surgery = mockSurgeryData[id as keyof typeof mockSurgeryData];
  const [complicationScore, setComplicationScore] = useState("");
  // Fetch complication prediction when component mounts
  const fetchComplicationPrediction = async (surgery) => {
    
      const apiUrl = import.meta.env.VITE_VM_HTTP_URL; // Get API URL from .env
    // const response = await axios.get(apiBaseUrl);
    try {
      const response = await axios.get(`${apiUrl}/complication_prediction`);
      console.log("Prediction response:", response.data);
      setComplicationScore(response.data);

    }
    catch (error) {
    console.error("Failed to fetch complication prediction:", error);
    
    }
  };
  useEffect(() => {
      console.log('open : ', open)
      if (open) {
        console.log('open')
        fetchComplicationPrediction(surgery);
      }
    }, [open]);
    
  if (!surgery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-[#1A446D]">
          Surgery not found
        </h1>
        <Button 
          onClick={() => navigate("/timesheet")}
          className="bg-[#0096C7] text-white hover:bg-[#0078A4]"
        >
          Return to Schedule
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex items-center mb-8 space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/timesheet")}
          className="flex items-center text-[#0096C7] hover:text-[#0096C7]/80"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-[#1A446D]">
          {surgery.title}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-[#0096C7]" />
            <h2 className="text-xl font-semibold text-[#1A446D]">
              Surgery Details
            </h2>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Time</dt>
              <dd className="text-lg font-medium text-[#1A446D]">
                {surgery.startTime} - {surgery.endTime}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Room</dt>
              <dd className="text-lg font-medium text-[#1A446D]">
                {surgery.patient.roomNumber}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="text-lg font-medium capitalize text-[#1A446D]">
                {surgery.status}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <UserRound className="h-5 w-5 mr-2 text-[#0096C7]" />
            <h2 className="text-xl font-semibold text-[#1A446D]">
              Patient Information
            </h2>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="text-lg font-medium text-[#1A446D]">
                {surgery.patient.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Age</dt>
              <dd className="text-lg font-medium text-[#1A446D]">
                {surgery.patient.age}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 rounded-lg shadow-sm md:col-span-2">
          <div className="flex items-center mb-4">
            <Stethoscope className="h-5 w-5 mr-2 text-[#0096C7]" />
            <h2 className="text-xl font-semibold text-[#1A446D]">
              Medical Notes
            </h2>
          </div>
          <p className="text-gray-700">
            {surgery.notes}
          </p>
          <p className="text-gray-700">
            
            {parseFloat(complicationScore) * 100 < 20 ? 'Limited Risk of complication : ' : parseFloat(complicationScore) * 100 <= 50 ? 'Significant Risk of complication : ' : 'Critical Risk of complication : '}
            {parseFloat(complicationScore) * 100} 
        </p>

        
        </Card>
      </div>
    </motion.div>
  );
};

export default Surgery;
