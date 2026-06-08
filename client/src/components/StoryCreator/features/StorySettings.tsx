import { TextField } from "@mui/material";
import { ProfileInfo, StoryParams } from "../store/state";

import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import { Tone, Tones } from "src/shared/mockedData/Tone";
import CustomizableSelect from "src/components/shared/CustomizableSelect";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";

export interface StorySettingsParams {
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateStoryInfo: (
    name: string,
    value: Moral | Tone | Environment,
  ) => void;
}

const StorySettings = (props: StorySettingsParams) => {
  const { profileInfo, storyParams, handleFieldChange, handleUpdateStoryInfo } =
    props;

  return (
    <>
      <CustomizableSelect
        name="moral"
        label="Moral"
        value={storyParams.moral}
        options={Morals}
        onChange={handleUpdateStoryInfo}
      />

      <CustomizableSelect
        name="tone"
        label="Tone"
        value={storyParams.tone}
        options={Tones}
        onChange={handleUpdateStoryInfo}
      />

      <CustomizableSelect
        name="environment"
        label="Environment"
        value={storyParams.environment}
        options={Environments}
        onChange={handleUpdateStoryInfo}
      />

      <TextField
        type="text"
        id="interests"
        name="interests"
        className="form-item"
        label="Other Interests"
        value={profileInfo.interests}
        error={hasCensoredWords(profileInfo.interests)}
        helperText={
          hasCensoredWords(profileInfo.interests) && "Not Appropriate 🙈"
        }
        onChange={handleFieldChange}
      />
    </>
  );
};

export default StorySettings;
