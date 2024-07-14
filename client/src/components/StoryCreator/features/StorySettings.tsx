import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ProfileInfo, StoryParams } from "../store/state";

import { Environments } from "src/shared/mockedData/Environments";
import { Morals } from "src/shared/mockedData/Moral";
import { Tones } from "src/shared/mockedData/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";

export interface StorySettingsParams {
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSelectChange: (event: SelectChangeEvent) => void;
}

const StorySettings = (props: StorySettingsParams) => {
  const { profileInfo, storyParams, handleFieldChange, handleOnSelectChange } =
    props;

  return (
    <>
      <FormControl className="form-item">
        <InputLabel id="nationality-select-label">Moral</InputLabel>
        <Select
          name="moral"
          label="Moral"
          variant="outlined"
          id="story-moral-select"
          value={storyParams.moral.value}
          labelId="story-moral-select-label"
          onChange={handleOnSelectChange}
        >
          {Morals.map((moral, index) => {
            return (
              <MenuItem key={index} value={moral.value}>
                {moral.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className="form-item">
        <InputLabel id="nationality-select-label">Tone</InputLabel>
        <Select
          name="tone"
          variant="outlined"
          label="Tone"
          id="story-tone-select"
          value={storyParams.tone.value}
          labelId="story-tone-select-label"
          onChange={handleOnSelectChange}
        >
          {Tones.map((tone, index) => {
            return (
              <MenuItem key={index} value={tone.value}>
                {tone.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className="form-item">
        <InputLabel id="nationality-select-label">Environment</InputLabel>
        <Select
          name="environment"
          variant="outlined"
          label="Environment"
          id="environment-select"
          value={storyParams.environment?.value}
          labelId="environment-select-label"
          onChange={handleOnSelectChange}
        >
          {Environments.map((environment, index) => {
            return (
              <MenuItem key={index} value={environment.value}>
                {environment.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

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
