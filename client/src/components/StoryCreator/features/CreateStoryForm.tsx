import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AdultGenderEnum, ChildGenderEnum, ProfileInfo } from "../store/state";
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

import ArtStyleChooser from "src/components/shared/ArtStyleChooser";
import AvatarPicker from "./AvatarPicker";
import FormatChooser from "src/components/shared/FormatChooser";
import StorySettings from "./StorySettings";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { saveCreateDraft } from "src/shared/utils/authReturn";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useEffect } from "react";
import { useGenerateStory } from "../hooks/useGenerateStory";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useSearchParams } from "react-router-dom";
import { useStoryCreatorContext } from "../store/Provider";

const CreateStoryForm = () => {
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

  const { isGenerating, generateStory } = useGenerateStory();

  const [searchParams] = useSearchParams();
  const style = searchParams.get("style");
  // Deep-link from the "My Avatars" page "Create" button: preselect + prefill.
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
  } = useApplicationContext();

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const isUserActive = user && user.status === UserStatus.active;
  const hasMaxStoriesLimit =
    isAuthenticated &&
    user &&
    user.role !== UserRole.admin &&
    user.storyCount >= user.subscription.maxStoriesAllowed;

  const isCreateButtonDisabled = (): boolean => {
    if (
      isGenerating ||
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

  // Persist the in-progress form before sending the user off to authenticate,
  // then open the login modal. After a Google redirect the draft is restored
  // when /create remounts; for in-place phone OTP the live form is kept.
  const openLoginModal = () => {
    saveCreateDraft({ profileInfo, storyParams, format, artStyle, avatarId });
    handleToggleLoginModal();
  };

  const handleOnFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const form = event.currentTarget;
    if (!form.checkValidity() || isFormHasErrors()) {
      form.reportValidity();
      return;
    }

    void generateStory({ source: "create_form" });
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
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleOnFormSubmit}
        className="story-creator-form-wrapper"
        sx={{
          marginY: 4,
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Box sx={{ width: "100%", mb: 3 }}>
          <FormatChooser
            value={format}
            onChange={handleSetFormat}
            variant={isDesktop ? "row" : "stacked"}
          />
        </Box>

        <Grid
          container
          spacing={4}
          sx={{
            width: "100%",
            marginY: 4
          }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ width: "100%", mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 1
                }}>
                Art style
              </Typography>

              <ArtStyleChooser
                value={artStyle}
                onChange={handleSetArtStyle}
                variant={isDesktop ? "row" : "stacked"}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* <Box sx={{ width: "100%", mb: 3 }}> */}
            <AvatarPicker
              value={avatarId}
              autoSelectId={preselectAvatarId}
              onChange={(_id, avatar) => handleSelectAvatar(avatar ?? null)}
              enabled={isAuthenticated}
              onRequestLogin={openLoginModal}
            />
            {/* </Box> */}
          </Grid>
        </Grid>

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
          component="div"
          className="story-creator-form-wrapper-button"
          sx={{
            display: "flex",
            marginX: 2,
            marginY: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}>
          {isAuthenticated && isUserActive && hasMaxStoriesLimit ? (
            <Button
              type="button"
              color="secondary"
              variant="contained"
              title="subscribe-button"
              endIcon={<LoyaltyOutlined />}
              onClick={() => handleTogglePricingModal("create_form")}
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
