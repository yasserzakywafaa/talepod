export interface TargetAudience {
  name: string;
  value: string;
  customValue: string;
  isBasic?: boolean;
  isEssential?: boolean;
  isPremium?: boolean;
}

export enum TargetAudienceEnum {
  SMALL_BUSINESS = "Small business owners",
  ENTREPRENEURS = "Entrepreneurs",
  FREELANCERS = "Freelancers",
  MARKETING_PROFESSIONALS = "Marketing professionals",
  PARENTS = "Parents",
  FITNESS_ENTHUSIASTS = "Fitness enthusiasts",
  TECH_ENTHUSIASTS = "Tech enthusiasts",
  CONTENT_CREATORS = "Content creators",
  STUDENTS = "Students",
  TEACHERS_AND = "Teachers and educators",
  REAL_ESTATE = "Real estate agents",
  E_COMMERCE_OPERATORS = "E-commerce operators",
  SUSTAINABILITY_ADVOCATES = "Sustainability advocates",
  HR_PROFESSIONALS = "HR professionals",
  GAMERS = "Gamers",
  PET_OWNERS = "Pet owners",
  TRAVEL_ENTHUSIASTS = "Travel enthusiasts",
  CUSTOM = "Custom (Enter your own)",
}

export const targetAudienceOptions: TargetAudience[] = [
  { name: "None...", value: "", customValue: "" },
  {
    name: TargetAudienceEnum.SMALL_BUSINESS,
    value: TargetAudienceEnum.SMALL_BUSINESS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.ENTREPRENEURS,
    value: TargetAudienceEnum.ENTREPRENEURS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.FREELANCERS,
    value: TargetAudienceEnum.FREELANCERS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.MARKETING_PROFESSIONALS,
    value: TargetAudienceEnum.MARKETING_PROFESSIONALS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.PARENTS,
    value: TargetAudienceEnum.PARENTS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.FITNESS_ENTHUSIASTS,
    value: TargetAudienceEnum.FITNESS_ENTHUSIASTS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.TECH_ENTHUSIASTS,
    value: TargetAudienceEnum.TECH_ENTHUSIASTS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.CONTENT_CREATORS,
    value: TargetAudienceEnum.CONTENT_CREATORS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.STUDENTS,
    value: TargetAudienceEnum.STUDENTS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.TEACHERS_AND,
    value: TargetAudienceEnum.TEACHERS_AND,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.REAL_ESTATE,
    value: TargetAudienceEnum.REAL_ESTATE,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.E_COMMERCE_OPERATORS,
    value: TargetAudienceEnum.E_COMMERCE_OPERATORS,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.SUSTAINABILITY_ADVOCATES,
    value: TargetAudienceEnum.SUSTAINABILITY_ADVOCATES,
    customValue: "",
  },
  {
    name: TargetAudienceEnum.HR_PROFESSIONALS,
    value: TargetAudienceEnum.HR_PROFESSIONALS,
    customValue: "",
    isBasic: true,
  },
  {
    name: TargetAudienceEnum.GAMERS,
    value: TargetAudienceEnum.GAMERS,
    customValue: "",
    isBasic: true,
  },
  {
    name: TargetAudienceEnum.PET_OWNERS,
    value: TargetAudienceEnum.PET_OWNERS,
    customValue: "",
    isEssential: true,
  },
  {
    name: TargetAudienceEnum.TRAVEL_ENTHUSIASTS,
    value: TargetAudienceEnum.TRAVEL_ENTHUSIASTS,
    customValue: "",
    isEssential: true,
  },
  {
    name: TargetAudienceEnum.CUSTOM,
    value: TargetAudienceEnum.CUSTOM,
    customValue: "",
    isPremium: true,
  },
];
