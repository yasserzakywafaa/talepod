import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import {
  Environment,
  Environments,
} from "src/shared/generatedStory/Environments";
import { Language, Languages } from "../../../shared/languages";
import { Moral, Morals } from "src/shared/generatedStory/Moral";
import { Tone, Tones } from "src/shared/generatedStory/Tone";

import { AutoAwesome } from "@mui/icons-material";
import { ChildGenderEnum } from "../store/state";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useOpenAiGPTContext } from "./OpenAiGPT/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const GenerationOptionsForm = () => {
  const {
    store: {
      state: { childInfo, generatedStory },
    },
    manager: { handleUpdateChildInfo, handleUpdateStoryInfo },
  } = useStoryCreatorContext();

  const { store: OpenaiGPTStore, manager: OpenaiGPTManager } =
    useOpenAiGPTContext();
  const { isFetching, userPrompt, autoTextPrompt } =
    OpenaiGPTStore.state.textGeneration;
  const { handleIsTextGenFetching, handleGenerateTextRequest } =
    OpenaiGPTManager;

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userPrompt || autoTextPrompt) {
      handleIsTextGenFetching(true);
      handleGenerateTextRequest(userPrompt || autoTextPrompt);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateChildInfo(name, value);
  };

  const handleOnSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    switch (name) {
      case "gender":
        handleUpdateChildInfo(name, value);
        break;

      case "language":
        const currentCountryValue = Languages.find((c) => c.value === value);
        handleUpdateChildInfo(name, currentCountryValue as Language);
        break;

      case "moral":
        const currentMoralValue = Morals.find((m) => m.value === value);
        handleUpdateStoryInfo(name, currentMoralValue as Moral);
        break;

      case "tone":
        const currenToneValue = Tones.find((t) => t.value === value);
        handleUpdateStoryInfo(name, currenToneValue as Tone);
        break;

      case "environment":
        const currenEnvironmentValue = Environments.find(
          (e) => e.value === value
        );
        handleUpdateStoryInfo(name, currenEnvironmentValue as Environment);
        break;
    }
  };

  return (
    <Container className="story-creator" maxWidth={false}>
      <Typography
        variant="h2"
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#000" : "#fff"),
          fontSize: { xs: 20, sm: 30 },
        }}
      >
        Create a story for your child
      </Typography>

      {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

      <Box
        marginY={4}
        display="flex"
        noValidate
        width="100%"
        flexWrap="wrap"
        component="form"
        autoComplete="off"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        className="child-info-form"
        onSubmit={handleOnFormSubmit}
      >
        <FormControl className="child-info-form-item">
          <InputLabel id="nationality-select-label">Gender</InputLabel>
          <Select
            required
            name="gender"
            label="Gender"
            variant="outlined"
            id="story-gender-select"
            value={childInfo.gender}
            labelId="story-gender-select-label"
            onChange={handleOnSelectChange}
          >
            {Object.values(ChildGenderEnum).map((gender, index) => {
              return (
                <MenuItem key={index} value={gender}>
                  {gender}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          required
          id="age"
          name="age"
          label="Age"
          type="number"
          value={childInfo.age}
          error={!childInfo.age}
          className="child-info-form-item"
          onChange={handleFieldChange}
        />

        <FormControl className="child-info-form-item">
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            required
            name="language"
            variant="outlined"
            label="Language"
            id="language-select"
            value={childInfo.language.value}
            labelId="language-select-label"
            onChange={handleOnSelectChange}
          >
            {Languages.map((country, index) => {
              return (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          required
          id="name"
          name="name"
          label="Name"
          type="text"
          value={childInfo.name}
          error={!childInfo.name}
          className="child-info-form-item"
          onChange={handleFieldChange}
        />

        <FormControl className="child-info-form-item">
          <InputLabel id="nationality-select-label">Moral</InputLabel>
          <Select
            required
            name="moral"
            label="Moral"
            variant="outlined"
            id="story-moral-select"
            value={generatedStory.moral.value}
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

        <FormControl className="child-info-form-item">
          <InputLabel id="nationality-select-label">Tone</InputLabel>
          <Select
            required
            name="tone"
            variant="outlined"
            label="Tone"
            id="story-tone-select"
            value={generatedStory.tone.value}
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

        <FormControl className="child-info-form-item">
          <InputLabel id="nationality-select-label">Environment</InputLabel>
          <Select
            required
            name="environment"
            variant="outlined"
            label="Environment"
            id="environment-select"
            value={generatedStory.environment?.value}
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
          required
          id="interests"
          name="interests"
          label="Other Interests"
          type="text"
          value={childInfo.interests}
          error={!childInfo.interests}
          className="child-info-form-item"
          onChange={handleFieldChange}
        />

        <Box
          display="flex"
          marginX={2}
          width="100%"
          component="div"
          alignItems="center"
          justifyContent="center"
          className="child-info-form-button"
        >
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AutoAwesome />}
          >
            Generate
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default GenerationOptionsForm;
