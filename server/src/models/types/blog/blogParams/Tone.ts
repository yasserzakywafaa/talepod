export interface ToneStyle {
  name: string;
  value: string;
  customValue: string;
  isBasic?: boolean;
  isEssential?: boolean;
  isPremium?: boolean;
}

export enum ToneStyleEnum {
  FORMAL = "Formal",
  INFORMAL = "Informal",
  CONVERSATIONAL = "Conversational",
  TECHNICAL = "Technical",
  PERSUASIVE = "Persuasive",
  NEUTRAL = "Neutral",
  CREATIVE = "Creative",
  EMPATHETIC = "Empathetic",
  CUSTOM = "Custom (Enter your own)",
}

export const toneStylesOptions: ToneStyle[] = [
  { name: "None...", value: "", customValue: "" },
  { name: ToneStyleEnum.FORMAL, value: ToneStyleEnum.FORMAL, customValue: "" },
  {
    name: ToneStyleEnum.INFORMAL,
    value: ToneStyleEnum.INFORMAL,
    customValue: "",
  },
  {
    name: ToneStyleEnum.CONVERSATIONAL,
    value: ToneStyleEnum.CONVERSATIONAL,
    customValue: "",
  },
  {
    name: ToneStyleEnum.TECHNICAL,
    value: ToneStyleEnum.TECHNICAL,
    customValue: "",
  },
  {
    name: ToneStyleEnum.PERSUASIVE,
    value: ToneStyleEnum.PERSUASIVE,
    customValue: "",
    isBasic: true,
  },
  {
    name: ToneStyleEnum.NEUTRAL,
    value: ToneStyleEnum.NEUTRAL,
    customValue: "",
    isBasic: true,
  },
  {
    name: ToneStyleEnum.CREATIVE,
    value: ToneStyleEnum.CREATIVE,
    customValue: "",
    isEssential: true,
  },
  {
    name: ToneStyleEnum.EMPATHETIC,
    value: ToneStyleEnum.EMPATHETIC,
    customValue: "",
    isEssential: true,
  },

  {
    name: ToneStyleEnum.CUSTOM,
    value: ToneStyleEnum.CUSTOM,
    customValue: "",
    isPremium: true,
  },
];
