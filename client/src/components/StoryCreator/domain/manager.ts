import { Country, countries } from "src/shared/countries";

import { StoryCreatorStore } from "./store";

export interface StoryCreatorManager {
  handleUpdateChildInfo: (name: string, value: string | Country) => void;
}

export const useStoryCreatorManager = (
  store: StoryCreatorStore
): StoryCreatorManager => {
  const handleUpdateChildInfo = (name: string, value: string | Country) => {
    console.log("handleUpdateChildInfo:>>>", {
      name,
      value,
    });
    const isNationalityField = name === "nationality";
    const currentNationality = countries.find((c) => c.value === value);
    store.updateState({
      childInfo: {
        ...store.state.childInfo,
        [name]: isNationalityField ? currentNationality : value,
      },
    });
  };

  return {
    handleUpdateChildInfo,
  };
};
