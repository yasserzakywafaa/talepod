import {
  ArrowRightAltOutlined,
  AutoAwesomeOutlined,
} from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { ProfileInfo } from "../store/state";
import { UserRole, UserStatus } from "src/shared/types/user";
import { useEffect, useRef } from "react";

import { SupportedLanguages } from "src/shared/languages";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import routes from "src/application/routes";
import {
  consumePendingMiniStory,
  savePendingMiniStory,
} from "src/shared/utils/authReturn";
import { useApplicationContext } from "src/application/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { useGenerateStory } from "../hooks/useGenerateStory";
import { useStoryCreatorContext } from "../store/Provider";
import GeneratingScreen from "./GeneratingScreen";

const MINI_ENGLISH = { name: "English", value: SupportedLanguages.en };

const CreateStoryFormMini = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { profileInfo },
    },
    manager: { handleUpdateProfileInfo },
  } = useStoryCreatorContext();

  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
      },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { isVisible: isRegisterModalVisible },
      handleToggleRegisterModal,
    },
  } = useRegisterModalContext();

  const {
    isCreatingStory,
    isGenerationComplete,
    format,
    childName,
    generateStory,
  } = useGenerateStory();

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

  const handleOnFieldChangeForMini = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    handleUpdateProfileInfo(name as keyof ProfileInfo, value);
  };

  const handleOnAdvancedClick = () => {
    navigate(routes.create);
  };

  const runMiniGenerate = (name?: string) => {
    const resolvedName = name ?? profileInfo.name;
    void generateStory({
      profileOverride: {
        name: resolvedName,
        language: MINI_ENGLISH,
      },
    });
  };

  const handleOnFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (!form.checkValidity() || hasCensoredWords(profileInfo.name)) {
      form.reportValidity();
      return;
    }

    if (!isAuthenticated) {
      // Carry the typed name + "generate after auth" intent across the login
      // round-trip and open the modal instead of leaving the page.
      savePendingMiniStory(profileInfo.name);
      handleToggleRegisterModal();
      return;
    }

    runMiniGenerate();
  };

  // After authenticating from the mini form, prefill the saved name and auto-
  // generate — but only when the account can actually create right now, so we
  // never silently consume a credit on a blocked account. Covers both the
  // Google redirect (form remounts) and in-place phone OTP (form stays mounted).
  const autoGenerateHandledRef = useRef(false);
  useEffect(() => {
    if (autoGenerateHandledRef.current) return;
    if (!isAuthenticated || !user) return;

    const pending = consumePendingMiniStory();
    if (!pending) return;
    autoGenerateHandledRef.current = true;

    handleUpdateProfileInfo("name", pending.name);

    const canGenerate =
      !hasMaxStoriesLimit &&
      !!isUserActive &&
      !hasCensoredWords(pending.name) &&
      !hasCensoredWords(profileInfo.interests);
    if (canGenerate) {
      runMiniGenerate(pending.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // If the user closes the register modal without authenticating, drop the
  // pending intent so a later unrelated login can't trigger a surprise story.
  const prevRegisterModalVisibleRef = useRef(false);
  useEffect(() => {
    if (
      prevRegisterModalVisibleRef.current &&
      !isRegisterModalVisible &&
      !isAuthenticated
    ) {
      consumePendingMiniStory();
    }
    prevRegisterModalVisibleRef.current = isRegisterModalVisible;
  }, [isRegisterModalVisible, isAuthenticated]);

  return (
    <Box className="story-creator-form mini" width="100%">
      {(isCreatingStory || isGenerationComplete) && (
        <GeneratingScreen
          format={format}
          childName={childName}
          isComplete={isGenerationComplete}
        />
      )}
      <Box
        marginTop={4}
        marginBottom={1}
        display="flex"
        width="100%"
        flexWrap="wrap"
        component="form"
        autoComplete="off"
        flexDirection="column"
        alignItems={{ xs: "center", md: "flex-start" }}
        justifyContent={{ xs: "center", md: "flex-start" }}
        onSubmit={handleOnFormSubmit}
        className="story-creator-form-wrapper"
      >
        <TextField
          required
          id="name"
          name="name"
          type="text"
          className="form-item"
          label="Name"
          value={profileInfo.name}
          placeholder="Emily, Noah, etc."
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: "70%", sm: "50%" } }}
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
          alignItems="flex-start"
          flexDirection="column"
          className="blog-creator-form-wrapper-button"
        >
          <Button
            size="small"
            color="info"
            type="button"
            variant="text"
            sx={{ marginY: 1 }}
            title="more-story-options-available-button"
            endIcon={<ArrowRightAltOutlined />}
            onClick={handleOnAdvancedClick}
          >
            More story options available
          </Button>

          <Button
            type="submit"
            size="large"
            variant="contained"
            title="generate-story-button"
            disabled={isCreateButtonDisabled()}
            endIcon={<AutoAwesomeOutlined />}
          >
            Generate Story
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryFormMini;
