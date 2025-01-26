export interface Frequency {
  name: string;
  value: string;
  customValue: string;
}

export enum FrequencyEnum {
  DAILY = "Daily",
  TWICE_WEEK = "Twice a Week",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
}

export const frequencyOptions: Frequency[] = [
  { name: "None...", value: "", customValue: "" },
  { name: "Daily", value: FrequencyEnum.DAILY, customValue: "" },
  { name: "Twice a Week", value: FrequencyEnum.TWICE_WEEK, customValue: "" },
  { name: "Weekly", value: FrequencyEnum.WEEKLY, customValue: "" },
  { name: "Monthly", value: FrequencyEnum.MONTHLY, customValue: "" },
];
