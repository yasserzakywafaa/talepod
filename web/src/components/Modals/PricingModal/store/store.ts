import { PricingModalInitialState, getPricingModalInitialState } from "./state";

import { useState } from "react";
import { trackEvent } from "src/shared/utils/ga4";

export type PricingModalTrigger =
  | "locked_story"
  | "profile"
  | "create_form"
  | "other";

export interface PricingModalStore {
  state: PricingModalInitialState;
  handleTogglePricingModal: (trigger?: PricingModalTrigger) => void;
}

const usePricingModalStore = (): PricingModalStore => {
  const initialState = getPricingModalInitialState();
  const [state, setState] = useState<PricingModalInitialState>(initialState);

  const handleTogglePricingModal = (trigger: PricingModalTrigger = "other") => {
    setState((prevState) => {
      const willOpen = !prevState.isVisible;
      if (willOpen) {
        trackEvent("pricing_modal_open", { trigger });
      }
      return {
        ...prevState,
        isVisible: !prevState.isVisible,
      };
    });
  };

  return {
    state,
    handleTogglePricingModal,
  };
};

export default usePricingModalStore;
