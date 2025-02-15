// Define the Surgery interface so it can be reused across components.
export interface Surgery {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    status: "scheduled" | "in-progress" | "completed";
    progressStatus: "on-time" | "delayed" | "canceled";
    delayReason?: string;
    delayDuration?: number;
    timeType: "locked" | "estimated" | "dynamic";
    downstreamImpacts?: number;
}