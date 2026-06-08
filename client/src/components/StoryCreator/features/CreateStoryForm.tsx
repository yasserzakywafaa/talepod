import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
import {
  AutoAwesomeOutlined,
  ExpandMoreOutlined,
  LoyaltyOutlined,
} from "@mui/icons-material";
import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Language, Languages } from "../../../shared/languages";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import {
  SubscriptionPlanEnum,
  UserRole,
  UserStatus,
} from "src/shared/types/user";
import { Tone, Tones } from "src/shared/mockedData/Tone";
import { useNavigate, useSearchParams } from "react-router-dom";

import APP_CONSTANTS from "src/application/shared/app_constants";
import ArtStyleChooser from "src/components/shared/ArtStyleChooser";
import CharacterPicker from "./CharacterPicker";
import FormatChooser from "src/components/shared/FormatChooser";
import GeneratingScreen from "./GeneratingScreen";
import StorySettings from "./StorySettings";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useEffect } from "react";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useOpenaiContext } from "./Openai/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const CreateStoryForm = () => {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceSize();
  const {
    store: {
      state: {
        profileInfo,
        storyParams,
        isStorySettingsExpanded,
        format,
        artStyle,
        avatarId,
      },
    },
    store: storyCreatorStore,
    manager: {
      handleUpdateProfileInfo,
      handleUpdateStoryInfo,
      handleSetFormat,
      handleSetArtStyle,
      handleSelectAvatar,
    },
  } = useStoryCreatorContext();

  const [searchParams] = useSearchParams();
  const style = searchParams.get("style");
  // Deep-link from the "My Characters" page "Create" button: preselect + prefill.
  const preselectAvatarId = searchParams.get("avatarId") || undefined;

  useEffect(() => {
    if (style === "comic" || style === "long") {
      handleSetFormat(style);
    }
  }, [style]);

  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
      },
    },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const {
    store: {
      state: {
        createStory: { isFetching: isCreatingStory },
      },
    },
    manager: OpenaiManager,
  } = useOpenaiContext();
  const {
    isCreateStoryFetching,
    handleCreateStoryRequest,
    // handleCreateStorySeoRequest,
  } = OpenaiManager;

  const isUserActive = user && user.status === UserStatus.active;
  const hasMaxStoriesLimit =
    isAuthenticated &&
    user &&
    user.role !== UserRole.admin &&
    user.storyCount >= user.subscription.maxStoriesAllowed;

  const isCreateButtonDisabled = (): boolean => {
    if (
      hasMaxStoriesLimit ||
      (isAuthenticated && !isUserActive) ||
      hasCensoredWords(profileInfo.name) ||
      hasCensoredWords(profileInfo.interests)
    ) {
      return true;
    }

    return false;
  };

  const isFormHasErrors = (): boolean => {
    return (
      hasCensoredWords(profileInfo.name) ||
      hasCensoredWords(profileInfo.interests)
    );
  };

  const handleOnFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      // navigate(routes.auth.login);
      handleToggleLoginModal();
      return;
    }

    const form = event.currentTarget;
    if (!form.checkValidity() || isFormHasErrors()) {
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
          storyParams,
          format,
          artStyle,
          avatarId,
        );

        if (user) {
          const refreshedUser = await handleFetchUserInfo();
          if (refreshedUser) {
            handleSetAuthInfo({
              isAuthenticated: true,
              user: refreshedUser,
            });
          }

          if (story._id && story.slug) {
            navigate(routes.myStory(user._id, story.slug), {
              replace: false,
            });
            // window.localStorage.setItem("newStoryCreated", "true");
            window.localStorage.setItem(
              APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
              "true",
            );
          }
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
    gender: string | null,
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
          (e) => e.value === value,
        );
        handleUpdateStoryInfo(name, currenEnvironmentValue as Environment);
        break;
    }
  };

  const handleToggleStorySettings = (
    event: React.SyntheticEvent,
    expanded: boolean,
  ) => {
    storyCreatorStore.toggleStorySettings(expanded);
  };

  const renderCounterAlerts = () => {
    const isFreeSubs =
      user &&
      !user.isPaidUser &&
      user.subscription.type === SubscriptionPlanEnum.Free;
    const isProSubs =
      user &&
      user.isPaidUser &&
      user.subscription.type === SubscriptionPlanEnum.Premium;
    const isAdvancedSubs =
      user &&
      user.isPaidUser &&
      user.subscription.type === SubscriptionPlanEnum.Advanced;

    if (!isAuthenticated) return <></>;

    if (!isUserActive) {
      return (
        <Alert severity="error" variant="outlined">
          {"Your account is not active and not allowed to create stories!"}
        </Alert>
      );
    }

    if (user && user.role === UserRole.admin) {
      return (
        <Alert severity="info" variant="outlined">
          {`As an admin, you can create ♾️ number of stories 😎`}
        </Alert>
      );
    }

    if (!hasMaxStoriesLimit) {
      if (isFreeSubs || isProSubs || isAdvancedSubs) {
        return (
          <Alert severity="info" variant="outlined">
            {`You have ${
              user.subscription.maxStoriesAllowed - user.storyCount
            } stories left out of ${user.subscription.maxStoriesAllowed}`}
          </Alert>
        );
      }
      return <></>;
    } else {
      return (
        <Alert severity="warning" variant="outlined">
          {`You have consumed your maximum credit of ${user.subscription.maxStoriesAllowed} stories`}
        </Alert>
      );
    }
  };

  return (
    <Box className="story-creator-form">
      {isCreatingStory && (
        <GeneratingScreen format={format} childName={profileInfo.name} />
      )}
      <Box
        marginY={4}
        display="flex"
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
        <Box sx={{ width: "100%", mb: 3 }}>
          <FormatChooser
            value={format}
            onChange={handleSetFormat}
            variant={isDesktop ? "row" : "stacked"}
          />
        </Box>

        <Box sx={{ width: "100%", mb: 3 }}>
          <Box
            sx={{
              mb: 1,
              fontSize: 13,
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            Art style
          </Box>
          <ArtStyleChooser
            value={artStyle}
            onChange={handleSetArtStyle}
            variant={isDesktop ? "row" : "stacked"}
          />
        </Box>

        {isAuthenticated && (
          <Box sx={{ width: "100%", mb: 3 }}>
            <CharacterPicker
              value={avatarId}
              autoSelectId={preselectAvatarId}
              onChange={(_id, avatar) => handleSelectAvatar(avatar ?? null)}
              enabled={isAuthenticated}
            />
          </Box>
        )}

        <TextField
          required
          id="name"
          name="name"
          label="Name"
          type="text"
          value={profileInfo.name}
          className="form-item"
          error={hasCensoredWords(profileInfo.name)}
          helperText={
            hasCensoredWords(profileInfo.name) && "Not Appropriate 🙈"
          }
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
            handleUpdateStoryInfo={handleUpdateStoryInfo}
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
                handleUpdateStoryInfo={handleUpdateStoryInfo}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Alerts */}
        <Box
          sx={{
            gap: 1,
            marginY: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderCounterAlerts()}
        </Box>

        <Box
          display="flex"
          marginX={2}
          marginY={1}
          width="100%"
          component="div"
          alignItems="center"
          justifyContent="center"
          className="story-creator-form-wrapper-button"
        >
          {isAuthenticated && isUserActive && hasMaxStoriesLimit ? (
            <Button
              type="button"
              color="secondary"
              variant="contained"
              title="subscribe-button"
              endIcon={<LoyaltyOutlined />}
              onClick={handleTogglePricingModal}
            >
              Subscribe
            </Button>
          ) : (
            <Button
              type="submit"
              title="submit-button"
              variant="contained"
              disabled={isCreateButtonDisabled()}
              endIcon={<AutoAwesomeOutlined />}
            >
              {`Generate ${profileInfo.name ? `${profileInfo.name}'s ` : ""}${
                format === "comic" ? "comic" : "story"
              }`}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryForm;
