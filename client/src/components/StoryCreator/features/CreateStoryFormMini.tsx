import {
  ArrowRightAltOutlined,
  AutoAwesomeOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ChildGenderEnum, ProfileInfo } from "../store/state";
import { UserRole, UserStatus } from "src/shared/types/user";
import {
  consumePendingMiniStory,
  savePendingMiniStory,
} from "src/shared/utils/authReturn";
import { useEffect, useRef } from "react";

import { SupportedLanguages } from "src/shared/languages";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useGenerateStory } from "../hooks/useGenerateStory";
import { useNavigate } from "react-router-dom";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";
import { useTranslation } from "react-i18next";

const MINI_ENGLISH = { name: "English", value: SupportedLanguages.en };

// Bedtime landing page targets toddlers, so mini-form stories generate at a
// fixed child age (keeps pronouns and illustration prompts age-appropriate).
const MINI_DEFAULT_AGE = 3;

const CreateStoryFormMini = () => {
  const { t } = useTranslation("story");
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

  const { isGenerating, generateStory } = useGenerateStory();

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

  const handleOnFieldChangeForMini = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    handleUpdateProfileInfo(name as keyof ProfileInfo, value);
  };

  const handleGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    gender: string | null,
  ) => {
    if (gender !== null) {
      handleUpdateProfileInfo("gender", gender);
    }
  };

  const handleOnAdvancedClick = () => {
    navigate(routes.create);
  };

  const runMiniGenerate = (overrides?: {
    name?: string;
    gender?: ChildGenderEnum;
  }) => {
    void generateStory({
      profileOverride: {
        name: overrides?.name ?? profileInfo.name,
        gender: overrides?.gender ?? profileInfo.gender,
        age: MINI_DEFAULT_AGE,
        language: MINI_ENGLISH,
      },
      source: "hero_mini",
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
      // Carry the typed name + chosen gender + "generate after auth" intent
      // across the login round-trip and open the modal instead of leaving the
      // page.
      savePendingMiniStory({
        name: profileInfo.name,
        gender: profileInfo.gender as ChildGenderEnum,
      });
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
    handleUpdateProfileInfo("gender", pending.gender);

    const canGenerate =
      !hasMaxStoriesLimit &&
      !!isUserActive &&
      !hasCensoredWords(pending.name) &&
      !hasCensoredWords(profileInfo.interests);
    if (canGenerate) {
      runMiniGenerate({ name: pending.name, gender: pending.gender });
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
    <Box className="story-creator-form mini" sx={{
      width: "100%"
    }}>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleOnFormSubmit}
        className="story-creator-form-wrapper"
        sx={{
          marginTop: 4,
          marginBottom: 1,
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: { xs: "center", md: "flex-start" }
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: { xs: "90%", sm: "50%" },
            gap: 1
          }}>
          <TextField
            required
            id="name"
            name="name"
            type="text"
            label={t("form.nameLabel")}
            value={profileInfo.name}
            disabled={isGenerating}
            placeholder={t("form.mini.namePlaceholder")}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ flex: "1 1 65%", minWidth: 0 }}
            error={hasCensoredWords(profileInfo.name)}
            helperText={
              hasCensoredWords(profileInfo.name) && t("form.notAppropriate")
            }
            onChange={handleOnFieldChangeForMini}
          />

          <ToggleButtonGroup
            exclusive
            size="small"
            value={profileInfo.gender}
            aria-labelledby="gender-toggle"
            disabled={isGenerating}
            onChange={handleGenderChange}
            sx={{ flex: "0 0 35%" }}
          >
            <ToggleButton
              value={ChildGenderEnum.Boy}
              sx={{
                flex: 1,
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
              {ChildGenderEnum.Boy}
            </ToggleButton>

            <ToggleButton
              value={ChildGenderEnum.Girl}
              sx={{
                flex: 1,
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
              {ChildGenderEnum.Girl}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          component="div"
          className="blog-creator-form-wrapper-button"
          sx={{
            marginX: 2,
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column"
          }}>
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
            {t("form.mini.moreOptions")}
          </Button>

          <Button
            type="submit"
            size="large"
            variant="contained"
            title="generate-story-button"
            disabled={isCreateButtonDisabled()}
            endIcon={<AutoAwesomeOutlined />}
          >
            {t("form.mini.generate")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateStoryFormMini;
