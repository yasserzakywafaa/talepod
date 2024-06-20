import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ChildGenderEnum, ChildInfo } from "../store/state";
import {
  Environment,
  Environments,
} from "src/shared/generatedStory/Environments";
import { Language, Languages } from "../../../shared/languages";
import { Moral, Morals } from "src/shared/generatedStory/Moral";
import { Tone, Tones } from "src/shared/generatedStory/Tone";

import { AutoAwesome } from "@mui/icons-material";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useEffect } from "react";
import { useOpenAiGPTContext } from "./OpenAiGPT/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const GenerationOptionsForm = () => {
  const {
    store: {
      state: { childInfo, storyParams: generatedStory },
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

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (userPrompt || autoTextPrompt) {
      handleIsTextGenFetching(true);
      debugger;
      handleGenerateTextRequest(userPrompt || autoTextPrompt);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateChildInfo(name as keyof ChildInfo, value);
  };

  const handleAgeSliderChange = (
    event: Event,
    value: number,
    activeThumb: number
  ) => {
    if (Array.isArray(value)) {
      handleUpdateChildInfo("age", value[0]);
    } else {
      handleUpdateChildInfo("age", value);
    }
  };

  const handleGenderChange = (
    event: React.MouseEvent<HTMLElement>,
    gender: string | null
  ) => {
    if (gender !== null) {
      handleUpdateChildInfo("gender", gender);
    }
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

  useEffect(() => {
    console.log("ℹ️  FORM:>>>", { GPTState: OpenaiGPTStore.state });
  }, [OpenaiGPTStore.state]);

  return (
    <Box className="story-creator-form">
      <Typography
        variant="h2"
        sx={{
          // color: (theme) => (theme.palette.mode === "light" ? "#000" : "#fff"),
          fontSize: { xs: 20, sm: 30 },
          mt: 2,
          mb: 4,
        }}
      >
        Define your story
      </Typography>

      {isFetching && <LoaderSpinner style={{ position: "fixed" }} />}

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
        <TextField
          required
          id="name"
          name="name"
          label="Name"
          type="text"
          value={childInfo.name}
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

        <Box className="child-info-form-item">
          <Typography id="age-slider" gutterBottom>
            Age: {childInfo.age} years
          </Typography>
          <Slider
            marks
            min={0}
            max={12}
            step={1}
            value={childInfo.age}
            valueLabelDisplay="auto"
            aria-labelledby="age-slider"
            onChange={handleAgeSliderChange}
          />
        </Box>

        <Box className="child-info-form-item">
          <Typography id="gender-toggle" gutterBottom>
            Gender
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={childInfo.gender}
            aria-labelledby="gender-toggle"
            onChange={handleGenderChange}
          >
            <ToggleButton
              value={ChildGenderEnum.Boy}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {ChildGenderEnum.Boy}
            </ToggleButton>
            <ToggleButton
              value={ChildGenderEnum.Girl}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {ChildGenderEnum.Girl}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <FormControl className="child-info-form-item">
          <InputLabel id="nationality-select-label">Moral</InputLabel>
          <Select
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
          id="interests"
          name="interests"
          label="Other Interests"
          type="text"
          value={childInfo.interests}
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
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GenerationOptionsForm;
