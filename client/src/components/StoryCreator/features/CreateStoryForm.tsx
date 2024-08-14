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
import { AutoAwesomeOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Language, Languages } from "../../../shared/languages";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import { SubscriptionPlanEnum, UserRole, UserStatus } from "src/shared/user";
import { Tone, Tones } from "src/shared/mockedData/Tone";

import APP_CONSTANTS from "src/application/shared/app_constants";
import StorySettings from "./StorySettings";
import { getApplicationInitialState } from "src/application/store/state";
import { getLocalStorageAuthItems } from "src/shared/utils/localstorage";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useEffect } from "react";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
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

  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
      },
      handleIsFetchingUserInfo,
    },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const { manager: OpenaiManager } = useOpenaiContext();
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
    user.subscription.maxStoriesAllowed === user.storyCount;

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
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
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
          storyParams
        );

        if (user) {
          await handleFetchUserInfo(user._id);

          if (story._id && story.slug) {
            navigate(routes.myStory(user._id, story.slug), {
              replace: false,
            });
            window.localStorage.setItem("newStoryCreated", "true");
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

  const renderCounterAlerts = () => {
    const isFreeSubs =
      user &&
      !user.isPaidUser &&
      user.subscription.subscriptionPlanType === SubscriptionPlanEnum.free;
    const isProSubs =
      user &&
      user.isPaidUser &&
      user.subscription.subscriptionPlanType === SubscriptionPlanEnum.pro;
    const isAdvancedSubs =
      user &&
      user.isPaidUser &&
      user.subscription.subscriptionPlanType === SubscriptionPlanEnum.advanced;

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

  const handleUpdates = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    if (!storedAuthInfo.isAuthenticated) {
      // User is not logged in, set initial auth state
      handleSetAuthInfo(getApplicationInitialState().auth);

      // return;
    } else {
      // User is already logged in, update auth state
      const userId = storedAuthInfo.user?._id;
      if (userId) {
        const fetchedUser = await handleFetchUserInfo(userId);

        handleSetAuthInfo({
          isAuthenticated: true,
          user: fetchedUser,
        });

        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser)
        );
      }
    }
    handleIsFetchingUserInfo(false);
  };

  useEffect(() => {
    handleUpdates();
  }, []);

  // const handleCreateStoryLibrary = async () => {
  //   // Other languages popular names
  //   const names = {
  //     // en: { boy: "Liam", girl: "Olivia" },
  //     // ar: { boy: "Muhammad", girl: "Sara" },
  //     // es: { boy: "Mateo", girl: "Sofía" },
  //     // fr: { boy: "Léo", girl: "Jade" },
  //     // de: { boy: "Noah", girl: "Mia" },
  //     // pt: { boy: "Miguel", girl: "Maria" },
  //     // it: { boy: "Leonardo", girl: "Sofia" },
  //     // ja: { boy: "Haruto", girl: "Yui" },
  //     // ko: { boy: "Seo-jun", girl: "Seo-yeon" },
  //     // ru: { boy: "Artyom", girl: "Anna" },
  //     // hi: { boy: "Aarav", girl: "Aadhya" },
  //     // "zh-Hans": { boy: "Wei", girl: "Mei" },
  //   };
  //   // // English popular names
  //   // boyNames: [
  //   //   "Noah",
  //   //   "Oliver",
  //   //   "William",
  //   //   "James",
  //   //   "Henry",
  //   //   "Alexander",
  //   //   "George",
  //   //   "Harry",
  //   //   "Jack",
  //   //   "Oscar",
  //   // ],
  //   // girlNames: [
  //   //   "Olivia",
  //   //   "Emma",
  //   //   "Ava",
  //   //   "Sophia",
  //   //   "Amelia",
  //   //   "Isabella",
  //   //   "Evelyn",
  //   //   "Ivy",
  //   //   "Lily",
  //   //   "Rosie",
  //   // ],
  //   let totalCombinations = 0;
  //   let profileInfo: ProfileInfo | undefined;
  //   let storyParams: StoryParams | undefined;
  //   const gender = Math.random() < 0.5 ? "Boy" : "Girl";

  //   console.log(`random:>>> `, { profileInfo, storyParams });

  //   // Environments.forEach((environment) => {
  //   //   Tones.forEach((tone) => {
  //   //     Morals.forEach((moral) => {
  //   //       Object.keys(names).forEach(async (languageCode: string) => {
  //   //         const name =
  //   //           gender === "Boy"
  //   //             ? names[languageCode as keyof {}]["boy"]
  //   //             : names[languageCode as keyof {}]["girl"];

  //   //         const language = Languages.find(
  //   //           (lang) => lang.value === languageCode
  //   //         ) as Language;

  //   //         if (language === undefined) {
  //   //           console.log(`language:>>> `, { language });
  //   //         }

  //   //         profileInfo = {
  //   //           name,
  //   //           gender:
  //   //             gender === "Boy" ? ChildGenderEnum.Boy : ChildGenderEnum.Girl,
  //   //           age: Math.floor(Math.random() * 18),
  //   //           interests: "",
  //   //           language: language,
  //   //         };
  //   //         storyParams = {
  //   //           audioLength: 10,
  //   //           minCharacters: 3900,
  //   //           maxCharacters: 4000,
  //   //           totalCharacters: 4000,
  //   //           moral,
  //   //           tone,
  //   //           environment,
  //   //           createdByAdmin: true,
  //   //         };

  //   //         if (profileInfo && storyParams) {
  //   //           const createStoryPrompt = getCreateStoryPrompt({
  //   //             ...getStoryCreatorInitialState(),
  //   //             profileInfo,
  //   //             storyParams,
  //   //           });
  //   //           isCreateStoryFetching(true);
  //   //           try {
  //   //             const story: Story = await handleCreateStoryRequest(
  //   //               createStoryPrompt,
  //   //               profileInfo,
  //   //               storyParams
  //   //             );
  //   //             if (story._id && story.slug) {
  //   //               // SEO CREATION
  //   //               const storySEO = await handleCreateStorySeoRequest(
  //   //                 story._id,
  //   //                 getStorySeoPrompt(story)
  //   //               );
  //   //               console.log(`Story:>>>`, {
  //   //                 storyId: story._id,
  //   //                 storyProfileInfo: story.profileInfo,
  //   //                 storySEO: !!storySEO && !!storySEO.content.length,
  //   //               });
  //   //             }
  //   //           } catch (error) {
  //   //             console.error("❌ Failed to create a story!", {
  //   //               error,
  //   //             });
  //   //           } finally {
  //   //             isCreateStoryFetching(false);
  //   //           }
  //   //         }

  //   //         totalCombinations++;
  //   //       });
  //   //     });
  //   //   });
  //   // });

  //   console.log(`Total number of combinations: ${totalCombinations}`);
  // };

  return (
    <Box className="story-creator-form">
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
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            disabled={isCreateButtonDisabled()}
            endIcon={<AutoAwesomeOutlined />}
          >
            Create
          </Button>

          {/* <Button
            type="button"
            variant="outlined"
            endIcon={<AutoAwesomeOutlined />}
            onClick={handleCreateStoryLibrary}
          >
            Create Story Library
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryForm;
