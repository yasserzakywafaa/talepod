import { AdultGenderEnum, ChildGenderEnum, ChildInfo } from "../store/state";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { Story } from "src/application/shared/interfaces";
import routes from "src/application/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOpenAiGPTContext } from "./OpenAiGPT/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const GenerationOptionsForm = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { childInfo, storyParams: generatedStory },
    },
    store: storyCreatorStore,
    manager: { handleUpdateChildInfo, handleUpdateStoryInfo },
  } = useStoryCreatorContext();

  const { store: OpenaiGPTStore, manager: OpenaiGPTManager } =
    useOpenAiGPTContext();
  const { isFetching } = OpenaiGPTStore.state.textGeneration;
  const { handleIsTextGenFetching, handleGenerateTextRequest } =
    OpenaiGPTManager;

  const handleOnFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const { userPrompt, autoTextPrompt } =
      storyCreatorStore.state.textGeneration;

    if (userPrompt || autoTextPrompt) {
      handleIsTextGenFetching(true);
      try {
        const story: Story = await handleGenerateTextRequest(
          userPrompt || autoTextPrompt
        );
        handleIsTextGenFetching(false);

        if (story._id) navigate(routes.story(story._id));
      } catch (error) {
        console.error("❌ Failed to create a story!", {
          error,
        });
      }
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateChildInfo(name as keyof ChildInfo, value);
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

      case "age":
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
    // console.log("ℹ️  FORM:>>> textGeneration", {
    //   StoryCreatorState: storyCreatorStore.state.textGeneration.autoTextPrompt,
    // });
  }, [storyCreatorStore]);

  useEffect(() => {
    // console.log("ℹ️  FORM:>>>", { GPTState: OpenaiGPTStore.state });
  }, [OpenaiGPTStore.state]);

  return (
    <Box className="story-creator-form">
      <Typography
        sx={{
          fontSize: { xs: 20, sm: 30 },
          mt: 2,
          mb: 4,
          color: (theme) => theme.palette.primary.main,
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

        <FormControl className="child-info-form-item">
          <InputLabel id="age-select-label">Age</InputLabel>
          <Select
            name="age"
            label="Age"
            variant="outlined"
            id="age-select"
            value={childInfo.age.toString()}
            labelId="story-moral-select-label"
            onChange={handleOnSelectChange}
          >
            {[...Array(50).keys()].map((value) => (
              <MenuItem key={value + 1} value={value + 1}>
                {value + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="child-info-form-item">
          <ToggleButtonGroup
            exclusive
            value={childInfo.gender}
            aria-labelledby="gender-toggle"
            onChange={handleGenderChange}
          >
            <ToggleButton
              value={
                childInfo.age <= 18 ? ChildGenderEnum.Boy : AdultGenderEnum.Male
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                "&.Mui-selected": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.text.primary,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: (theme) => theme.palette.secondary.main,
                },
              }}
            >
              {childInfo.age <= 18 ? ChildGenderEnum.Boy : AdultGenderEnum.Male}
            </ToggleButton>

            <ToggleButton
              value={
                childInfo.age <= 18
                  ? ChildGenderEnum.Girl
                  : AdultGenderEnum.Female
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                "&.Mui-selected": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.text.primary,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: (theme) => theme.palette.secondary.main,
                },
              }}
            >
              {childInfo.age <= 18
                ? ChildGenderEnum.Girl
                : AdultGenderEnum.Female}
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
