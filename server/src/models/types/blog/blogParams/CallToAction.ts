export interface CallToAction {
  name: string;
  value: string;
  customValue: string;
  isBasic?: boolean;
  isEssential?: boolean;
  isPremium?: boolean;
}

export enum CallToActionEnum {
  SIGN_UP = "Sign up for your free trial today!",
  DOWNLOAD_GUIDE = "Download your free guide now.",
  LEARN_MORE = "Learn more about our services.",
  CONTACT_US = "Contact us for a personalized consultation.",
  SHOP_COLLECTION = "Shop our latest collection.",
  JOIN_COMMUNITY = "Join our community of [target audience].",
  SUBSCRIBE = "Subscribe to stay updated.",
  CLAIM_DISCOUNT = "Claim your exclusive discount.",
  CUSTOM = "Custom (Enter your own)",
}

export const callToActionOptions: CallToAction[] = [
  { name: "None...", value: "", customValue: "" },
  {
    name: CallToActionEnum.SIGN_UP,
    value: CallToActionEnum.SIGN_UP,
    customValue: "",
  },
  {
    name: CallToActionEnum.DOWNLOAD_GUIDE,
    value: CallToActionEnum.DOWNLOAD_GUIDE,
    customValue: "",
  },
  {
    name: CallToActionEnum.LEARN_MORE,
    value: CallToActionEnum.LEARN_MORE,
    customValue: "",
  },
  {
    name: CallToActionEnum.CONTACT_US,
    value: CallToActionEnum.CONTACT_US,
    customValue: "",
  },
  {
    name: CallToActionEnum.SHOP_COLLECTION,
    value: CallToActionEnum.SHOP_COLLECTION,
    customValue: "",
    isBasic: true,
  },
  {
    name: CallToActionEnum.JOIN_COMMUNITY,
    value: CallToActionEnum.JOIN_COMMUNITY,
    customValue: "",
    isBasic: true,
  },
  {
    name: CallToActionEnum.SUBSCRIBE,
    value: CallToActionEnum.SUBSCRIBE,
    customValue: "",
    isEssential: true,
  },
  {
    name: CallToActionEnum.CLAIM_DISCOUNT,
    value: CallToActionEnum.CLAIM_DISCOUNT,
    customValue: "",
    isEssential: true,
  },
  {
    name: CallToActionEnum.CUSTOM,
    value: CallToActionEnum.CUSTOM,
    customValue: "",
    isPremium: true,
  },
];
