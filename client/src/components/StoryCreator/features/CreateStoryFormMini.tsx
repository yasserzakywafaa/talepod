import { AutoAwesomeOutlined, SettingsOutlined } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { ProfileInfo, Story } from "../store/state";
import { UserRole, UserStatus } from "src/shared/user";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { SupportedLanguages } from "src/shared/languages";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { useOpenaiContext } from "./Openai/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

const CreateStoryFormMini = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { profileInfo, storyParams },
    },
    store: storyCreatorStore,
    manager: { handleUpdateProfileInfo },
  } = useStoryCreatorContext();

  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
      },
    },
    manager: { handleFetchUserInfo },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const { manager: OpenaiManager } = useOpenaiContext();
  const { isCreateStoryFetching, handleCreateStoryRequest } = OpenaiManager;

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
    return hasCensoredWords(profileInfo.name);
  };

  const handleOnFieldChangeForMini = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    handleUpdateProfileInfo(name as keyof ProfileInfo, value);
  };

  const handleOnAdvancedClick = () => {
    navigate(routes.create);
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
          {
            ...profileInfo,
            language: {
              name: "English",
              value: SupportedLanguages.en,
            },
          },
          storyParams
        );

        if (user) {
          await handleFetchUserInfo(user._id);

          if (story._id && story.slug) {
            navigate(routes.myStory(user._id, story.slug), {
              replace: false,
            });
            window.localStorage.setItem(
              APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
              "true"
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

  return (
    <Box className="story-creator-form mini">
      <Box
        marginTop={4}
        marginBottom={1}
        display="flex"
        width="100%"
        flexWrap="wrap"
        component="form"
        autoComplete="off"
        flexDirection="column"
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
          sx={{ width: { xs: "80%", sm: "100%" } }}
          error={hasCensoredWords(profileInfo.name)}
          helperText={
            hasCensoredWords(profileInfo.name) && "Not Appropriate 🙈"
          }
          onChange={handleOnFieldChangeForMini}
        />

        <Box
          marginX={2}
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="blog-creator-form-wrapper-button"
        >
          <Button
            size="small"
            color="info"
            type="button"
            variant="text"
            sx={{ marginY: 1 }}
            title="advanced-button"
            startIcon={<SettingsOutlined />}
            onClick={handleOnAdvancedClick}
          >
            Advanced
          </Button>

          <Button
            type="submit"
            size="large"
            variant="contained"
            title="submit-button"
            disabled={isCreateButtonDisabled()}
            endIcon={<AutoAwesomeOutlined />}
          >
            {!isAuthenticated ? "Signup to Generate Story" : "Generate Story"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryFormMini;
