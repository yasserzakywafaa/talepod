export interface Time {
  name: string;
  value: string;
  customValue: string;
}

export enum TimeEnum {
  MORNING_9AM = "09:00",
  NOON_12PM = "12:00",
  AFTERNOON_3PM = "15:00",
  EVENING_6PM = "18:00",
  NIGHT_9PM = "21:00",
  // OTHER = "Other",
}

export const timeOptions: Time[] = [
  { name: "None...", value: "", customValue: "" },
  { name: "09:00 AM", value: TimeEnum.MORNING_9AM, customValue: "" },
  { name: "12:00 PM", value: TimeEnum.NOON_12PM, customValue: "" },
  { name: "03:00 PM", value: TimeEnum.AFTERNOON_3PM, customValue: "" },
  { name: "06:00 PM", value: TimeEnum.EVENING_6PM, customValue: "" },
  { name: "09:00 PM", value: TimeEnum.NIGHT_9PM, customValue: "" },
  // { name: "Other", value: TimeEnum.OTHER, customValue: "" },
];
