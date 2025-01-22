export interface ContentStructure {
  name: string;
  value: string;
  description?: string;
  customValue: string;
  isBasic?: boolean;
  isEssential?: boolean;
  isPremium?: boolean;
}

export enum ContentStructureEnum {
  LISTICLES = "Listicles",
  HOW_TO_GUIDES = "How-to guides",
  COMPARISONS = "Comparisons",
  FAQS = "FAQs",
  CASE_STUDIES = "Case studies",
  OPINION_PIECES = "Opinion pieces",
  LONG_FORM_CONTENT = "Long-form content",
  INTERACTIVE_CONTENT = "Interactive content",
  CUSTOM = "Custom (Enter your own)",
}

export const contentStructureOptions: ContentStructure[] = [
  { name: "None...", value: "", description: "", customValue: "" },
  {
    name: ContentStructureEnum.LISTICLES,
    value: ContentStructureEnum.LISTICLES,
    description: "“Top 5 tips for X”",
    customValue: "",
  },
  {
    name: ContentStructureEnum.HOW_TO_GUIDES,
    value: ContentStructureEnum.HOW_TO_GUIDES,
    description: "“Step-by-step instructions for Y”",
    customValue: "",
  },
  {
    name: ContentStructureEnum.COMPARISONS,
    value: ContentStructureEnum.COMPARISONS,
    description: "“X vs. Y: Which is better?”",
    customValue: "",
  },
  {
    name: ContentStructureEnum.FAQS,
    value: ContentStructureEnum.FAQS,
    description: "“Everything you need to know about Z”",
    customValue: "",
  },
  {
    name: ContentStructureEnum.CASE_STUDIES,
    value: ContentStructureEnum.CASE_STUDIES,
    description: "“How Company X increased sales”",
    customValue: "",
    isBasic: true,
  },
  {
    name: ContentStructureEnum.OPINION_PIECES,
    value: ContentStructureEnum.OPINION_PIECES,
    description: "“Why Z is the future of the industry”",
    customValue: "",
    isBasic: true,
  },
  {
    name: ContentStructureEnum.LONG_FORM_CONTENT,
    value: ContentStructureEnum.LONG_FORM_CONTENT,
    description: "“Detailed analysis or research”",
    customValue: "",
    isEssential: true,
  },
  {
    name: ContentStructureEnum.INTERACTIVE_CONTENT,
    value: ContentStructureEnum.INTERACTIVE_CONTENT,
    description: "“Calculate your savings with our tool”",
    customValue: "",
    isEssential: true,
  },
  {
    name: ContentStructureEnum.CUSTOM,
    value: ContentStructureEnum.CUSTOM,
    customValue: "",
    isPremium: true,
  },
];
