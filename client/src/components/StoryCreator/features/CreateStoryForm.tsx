import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
} from "@mui/material";
import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  Story,
} from "../store/state";
import { AutoAwesomeOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Language, Languages } from "../../../shared/languages";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import { Tone, Tones } from "src/shared/mockedData/Tone";

import StorySettings from "./StorySettings";
import routes from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useNavigate } from "react-router-dom";
import { useOpenaiContext } from "./Openai/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const CreateStoryForm = () => {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceSize();
  const {
    store: {
      state: { profileInfo, storyParams, isStorySettingsExpanded },
    },
    store: storyCreatorStore,
    manager: { handleUpdateProfileInfo, handleUpdateStoryInfo },
  } = useStoryCreatorContext();

  const { manager: OpenaiManager } = useOpenaiContext();
  const { isCreateStoryFetching, handleCreateStoryRequest } = OpenaiManager;

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

    const { createStoryPrompt } = storyCreatorStore.state.createStory;

    if (createStoryPrompt) {
      isCreateStoryFetching(true);
      try {
        const story: Story = await handleCreateStoryRequest(
          createStoryPrompt,
          profileInfo,
          storyParams
        );

        if (story._id) {
          navigate(routes.story(story._id), { replace: false });
          window.localStorage.setItem("newStoryCreated", "true");
        }
      } catch (error) {
        console.error("❌ Failed to create a story!", {
          error,
        });
      } finally {
        isCreateStoryFetching(false);
      }
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateProfileInfo(name as keyof ProfileInfo, value);
  };

  const handleGenderChange = (
    event: React.MouseEvent<HTMLElement>,
    gender: string | null
  ) => {
    if (gender !== null) {
      handleUpdateProfileInfo("gender", gender);
    }
  };

  const handleOnSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    switch (name) {
      case "gender":
        handleUpdateProfileInfo(name, value);
        break;

      case "age":
        handleUpdateProfileInfo(name, value);
        break;

      case "language":
        const currentCountryValue = Languages.find((c) => c.value === value);
        handleUpdateProfileInfo(name, currentCountryValue as Language);
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

  const handleToggleStorySettings = (
    event: React.SyntheticEvent,
    expanded: boolean
  ) => {
    storyCreatorStore.toggleStorySettings(expanded);
  };

  return (
    <Box className="story-creator-form">
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
        onSubmit={handleOnFormSubmit}
        className="story-creator-form-wrapper"
      >
        <TextField
          required
          id="name"
          name="name"
          label="Name"
          type="text"
          value={profileInfo.name}
          className="form-item"
          onChange={handleFieldChange}
        />

        <FormControl className="form-item">
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            required
            name="language"
            variant="outlined"
            label="Language"
            id="language-select"
            value={profileInfo.language.value}
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

        <FormControl className="form-item">
          <InputLabel id="age-select-label">Age</InputLabel>
          <Select
            name="age"
            label="Age"
            variant="outlined"
            id="age-select"
            value={profileInfo.age.toString()}
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

        <Box className="form-item">
          <ToggleButtonGroup
            exclusive
            value={profileInfo.gender}
            aria-labelledby="gender-toggle"
            onChange={handleGenderChange}
          >
            <ToggleButton
              value={
                profileInfo.age <= 18
                  ? ChildGenderEnum.Boy
                  : AdultGenderEnum.Male
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                "&.Mui-selected": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.text.primary,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
              }}
            >
              {profileInfo.age <= 18
                ? ChildGenderEnum.Boy
                : AdultGenderEnum.Male}
            </ToggleButton>

            <ToggleButton
              value={
                profileInfo.age <= 18
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
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
              }}
            >
              {profileInfo.age <= 18
                ? ChildGenderEnum.Girl
                : AdultGenderEnum.Female}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {isDesktop && (
          <StorySettings
            profileInfo={profileInfo}
            storyParams={storyParams}
            handleFieldChange={handleFieldChange}
            handleOnSelectChange={handleOnSelectChange}
          />
        )}

        {!isDesktop && (
          <Accordion
            className="story-settings-form"
            expanded={isStorySettingsExpanded}
            onChange={handleToggleStorySettings}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreOutlined />}
              id="story-settings-form-accordion-summary"
              className="story-settings-form-accordion-summary"
              aria-controls="story-settings-form-accordion-summary"
            >
              More story settings (optional)
            </AccordionSummary>
            <AccordionDetails
              id="story-settings-form-accordion-details"
              className="story-settings-form-accordion-details"
              aria-controls="story-settings-form-accordion-details"
            >
              <StorySettings
                profileInfo={profileInfo}
                storyParams={storyParams}
                handleFieldChange={handleFieldChange}
                handleOnSelectChange={handleOnSelectChange}
              />
            </AccordionDetails>
          </Accordion>
        )}

        <Box
          display="flex"
          marginX={2}
          marginY={2}
          width="100%"
          component="div"
          alignItems="center"
          justifyContent="center"
          className="story-creator-form-wrapper-button"
        >
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AutoAwesomeOutlined />}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryForm;
