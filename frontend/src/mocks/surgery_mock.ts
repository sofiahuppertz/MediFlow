import { Surgery } from "@/interfaces/surgery";


export const mockSurgeries: Surgery[] = [
    {
      id: "1",
      title: "Appendectomy",
      startTime: "07:00",
      endTime: "11:30",
      status: "scheduled",
      progressStatus: "on-time",
      timeType: "dynamic",
    },
    
    {
      id: "2",
      title: "Hip Replacement",
      startTime: "12:00",
      endTime: "13:30",
      status: "in-progress",
      progressStatus: "delayed",
      delayReason: "Equipment setup",
      delayDuration: 30,
      timeType: "estimated",
      downstreamImpacts: 2,
    },
    {
      id: "3",
      title: "Cardiac Surgery",
      startTime: "14:00",
      endTime: "15:00",
      status: "scheduled",
      progressStatus: "on-time",
      timeType: "locked",
    },
  ];