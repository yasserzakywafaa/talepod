import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Snackbar, TextInput } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { CreateTabStackParamList } from "src/application/navigation/CreateTabStackNavigator";
import {
  openRootSheet,
  navigateToMainMyStories,
  navigateToMainMyAvatars,
  navigateToPublicMarketingScreen,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { MainShellAppBar } from "src/components/chrome/MainShellAppBar";
import { Page } from "src/components/layout/Page";
import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { useThemedTextInputProps } from "src/components/layout/useScreenTypography";
import { Accordion } from "src/components/brand/Accordion";
import { ArtStyleChooser } from "src/components/brand/ArtStyleChooser";
import { AvatarPicker } from "src/components/brand/AvatarPicker";
import { ChoiceChip } from "src/components/brand/ChoiceChip";
import { DisplayText } from "src/components/brand/DisplayText";
import { FormatChooser } from "src/components/brand/FormatChooser";
import { PillButton } from "src/components/brand/PillButton";
import { SectionLabel } from "src/components/brand/SectionLabel";
import { SegmentedControl } from "src/components/brand/SegmentedControl";
import { SelectField } from "src/components/brand/SelectField";
import { useGenerateStory } from "src/features/storyCreator/hooks/useGenerateStory";
import { useAvatarsList } from "src/features/storyCreator/hooks/useAvatarsList";
import { useStoryCreatorContext } from "src/features/storyCreator/store/Provider";
import { getCreateStoryErrorMessage } from "src/features/storyCreator/openai/useCreateStory";
import {
  AdultGenderEnum,
  ChildGenderEnum,
  type StoryFormat,
} from "src/features/storyCreator/store/state";
import { Languages, type Language } from "src/shared/languages";
import { Environments } from "src/shared/storyOptions/Environments";
import { Morals } from "src/shared/storyOptions/Moral";
import { Tones } from "src/shared/storyOptions/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { saveCreateDraft } from "src/shared/utils/authReturn";
import { UserRole, UserStatus } from "src/shared/types/user";

type Props = {
  embeddedInMainShell?: boolean;
} & Partial<
  NativeStackScreenProps<
    CreateTabStackParamList,
    typeof mobileRoutes.authenticated.create
  >
>;

const TIP_KEYS = ["familiar", "moral", "interactive"] as const;

export const CreateStoryScreen = ({
  navigation,
  embeddedInMainShell,
}: Props) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const inputProps = useThemedTextInputProps();
  const { horizontalGutter } = useReadableLayout();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { profileInfo, storyParams, format, artStyle, avatarId },
    },
    manager: {
      handleUpdateProfileInfo,
      handleUpdateStoryInfo,
      handleSetFormat,
      handleSetArtStyle,
      handleSelectAvatar,
    },
  } = useStoryCreatorContext();

  const { isGenerating, isCreatingStory, generateStory } = useGenerateStory();
  const {
    avatars,
    isLoading: avatarsLoading,
    loadError: avatarsError,
    refetch: refetchAvatars,
  } = useAvatarsList(auth.isAuthenticated);

  const user = auth.user;
  const isUserActive = user && user.status === UserStatus.active;
  const hasMaxStoriesLimit =
    auth.isAuthenticated &&
    user &&
    user.role !== UserRole.admin &&
    user.storyCount >= user.subscription.maxStoriesAllowed;

  const genders =
    profileInfo.age >= 19
      ? [AdultGenderEnum.Male, AdultGenderEnum.Female]
      : [ChildGenderEnum.Boy, ChildGenderEnum.Girl];

  const submitDisabled =
    isGenerating ||
    isCreatingStory ||
    hasMaxStoriesLimit ||
    (auth.isAuthenticated && !isUserActive) ||
    hasCensoredWords(profileInfo.name) ||
    hasCensoredWords(profileInfo.interests) ||
    !profileInfo.name.trim();

  const ctaLabel = profileInfo.name.trim()
    ? format === "comic"
      ? t("form.generateComic", { name: profileInfo.name.trim() })
      : t("form.generateStory", { name: profileInfo.name.trim() })
    : format === "comic"
      ? t("form.generateComicAnonymous")
      : t("form.generateStoryAnonymous");

  const onSubmit = async () => {
    if (!auth.isAuthenticated) {
      await saveCreateDraft({
        profileInfo,
        storyParams,
        format,
        artStyle,
        avatarId,
      });
      openRootSheet(mobileRoutes.public.login);
      return;
    }
    if (hasMaxStoriesLimit) {
      navigateToPublicMarketingScreen(mobileRoutes.public.pricing);
      return;
    }
    try {
      setErrorMessage(null);
      await generateStory({ source: "create_form" });
      if (embeddedInMainShell) {
        navigateToMainMyStories();
      } else {
        navigation?.goBack();
      }
    } catch (error) {
      setErrorMessage(getCreateStoryErrorMessage(error));
    }
  };

  const shellDrawer = useMainShellDrawer();
  const drawerNavigation = embeddedInMainShell ? shellDrawer : undefined;

  const body = (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingHorizontal: horizontalGutter },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero — serif heading in honey over centred body copy, as on web. */}
      <View style={styles.hero}>
        <DisplayText size={28} color={theme.colors.primary} style={styles.center}>
          {t("createPage.heading")}
        </DisplayText>
        <Text
          style={[
            styles.subheading,
            {
              color: theme.colors.onSurface,
              fontFamily: theme.tokens.fontFamily.regular,
            },
          ]}
        >
          {t("createPage.subheading")}
        </Text>
      </View>

      <FormatChooser
        value={format}
        onChange={(value: StoryFormat) => handleSetFormat(value)}
      />

      <View style={styles.section}>
        <SectionLabel>{t("form.artStyleLabel")}</SectionLabel>
        <ArtStyleChooser value={artStyle} onChange={handleSetArtStyle} />
      </View>

      <AvatarPicker
        value={avatarId ?? null}
        avatars={avatars}
        isLoading={avatarsLoading}
        enabled={auth.isAuthenticated}
        onSelect={handleSelectAvatar}
        onRequestLogin={() => openRootSheet(mobileRoutes.public.login)}
        onManage={() => navigateToMainMyAvatars()}
        loadError={avatarsError}
        onRetry={() => void refetchAvatars()}
      />

      <View style={styles.section}>
        <TextInput
          label={t("form.nameLabel")}
          placeholder={t("form.mini.namePlaceholder")}
          value={profileInfo.name}
          onChangeText={(value) => handleUpdateProfileInfo("name", value)}
          mode="outlined"
          outlineStyle={{ borderRadius: theme.tokens.radius.md }}
          style={{ backgroundColor: theme.colors.background }}
          {...inputProps}
          error={hasCensoredWords(profileInfo.name)}
        />

        <SelectField
          label={t("form.languageLabel")}
          value={profileInfo.language.value}
          options={Languages.map((language) => ({
            value: language.value,
            label: language.name,
          }))}
          onChange={(value) => {
            const match = Languages.find(
              (language) => language.value === value,
            );
            if (match) handleUpdateProfileInfo("language", match as Language);
          }}
        />

        <View style={styles.pair}>
          <View style={styles.pairItem}>
            <TextInput
              label={t("form.ageLabel")}
              value={String(profileInfo.age)}
              onChangeText={(value) => {
                const parsed = parseInt(value, 10);
                if (!Number.isNaN(parsed))
                  handleUpdateProfileInfo("age", parsed);
              }}
              keyboardType="number-pad"
              mode="outlined"
              outlineStyle={{ borderRadius: theme.tokens.radius.md }}
              style={{ backgroundColor: theme.colors.background }}
              {...inputProps}
            />
          </View>
          <View style={styles.pairItem}>
            <SegmentedControl
              value={profileInfo.gender}
              options={genders.map((gender) => ({
                value: gender,
                label: gender,
              }))}
              onChange={(value) => handleUpdateProfileInfo("gender", value)}
            />
          </View>
        </View>
      </View>

      <Accordion
        title={t("form.moreSettings")}
        expanded={settingsOpen}
        onToggle={() => setSettingsOpen((open) => !open)}
      >
        <View style={styles.section}>
          <SectionLabel>{t("form.settings.moral")}</SectionLabel>
          <View style={styles.chipRow}>
            {Morals.slice(0, 8).map((moral) => (
              <ChoiceChip
                key={moral.value}
                label={moral.name}
                selected={storyParams.moral.value === moral.value}
                onPress={() => handleUpdateStoryInfo("moral", moral)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel>{t("form.settings.tone")}</SectionLabel>
          <View style={styles.chipRow}>
            {Tones.slice(0, 6).map((tone) => (
              <ChoiceChip
                key={tone.value}
                label={tone.name}
                selected={storyParams.tone.value === tone.value}
                onPress={() => handleUpdateStoryInfo("tone", tone)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel>{t("form.settings.environment")}</SectionLabel>
          <View style={styles.chipRow}>
            {Environments.slice(0, 6).map((environment) => (
              <ChoiceChip
                key={environment.value}
                label={environment.name}
                selected={storyParams.environment.value === environment.value}
                onPress={() =>
                  handleUpdateStoryInfo("environment", environment)
                }
              />
            ))}
          </View>
        </View>

        <TextInput
          label={t("form.settings.interests")}
          value={profileInfo.interests}
          onChangeText={(value) => handleUpdateProfileInfo("interests", value)}
          mode="outlined"
          outlineStyle={{ borderRadius: theme.tokens.radius.md }}
          style={{ backgroundColor: theme.colors.background }}
          {...inputProps}
          error={hasCensoredWords(profileInfo.interests)}
        />
      </Accordion>

      {hasMaxStoriesLimit ? (
        <Text
          style={[
            styles.limit,
            {
              color: theme.colors.error,
              fontFamily: theme.tokens.fontFamily.medium,
            },
          ]}
        >
          {t("form.alerts.limitReached", {
            max: user?.subscription.maxStoriesAllowed ?? 0,
          })}
        </Text>
      ) : null}

      <View style={styles.cta}>
        <PillButton
          onPress={() => void onSubmit()}
          disabled={submitDisabled}
          loading={isCreatingStory}
          trailingIcon="shimmer"
        >
          {ctaLabel}
        </PillButton>
      </View>

      {/* Tips — the same three-point list the web create page closes with. */}
      <View style={styles.tips}>
        <DisplayText size={22}>{t("createPage.tipsHeading")}</DisplayText>
        {TIP_KEYS.map((key, index) => (
          <View key={key} style={styles.tip}>
            <View
              style={[
                styles.tipNumber,
                { backgroundColor: theme.colors.secondary },
              ]}
            >
              <Text
                style={[
                  styles.tipNumberLabel,
                  { fontFamily: theme.tokens.fontFamily.bold },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <View style={styles.tipCopy}>
              <Text
                style={[
                  styles.tipTitle,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: theme.tokens.fontFamily.semiBold,
                  },
                ]}
              >
                {t(`createPage.tips.${key}.title`)}
              </Text>
              <Text
                style={[
                  styles.tipBody,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: theme.tokens.fontFamily.regular,
                  },
                ]}
              >
                {t(`createPage.tips.${key}.body`)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const content = (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {body}
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
      >
        {errorMessage}
      </Snackbar>
    </View>
  );

  if (embeddedInMainShell && drawerNavigation) {
    return (
      <Page header={<MainShellAppBar navigation={drawerNavigation} />}>
        {content}
      </Page>
    );
  }

  return (
    <Page
      header={
        navigation ? (
          <MainShellAppBar showBack onBack={() => navigation.goBack()} />
        ) : undefined
      }
    >
      {content}
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { gap: 20, paddingTop: 8, paddingBottom: 48 },
  hero: { gap: 8, alignItems: "center", paddingBottom: 4 },
  center: { textAlign: "center" },
  subheading: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    includeFontPadding: false,
  },
  section: { gap: 12 },
  pair: { flexDirection: "row", gap: 12, alignItems: "center" },
  pairItem: { flex: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  limit: { fontSize: 14, lineHeight: 20, includeFontPadding: false },
  cta: { alignItems: "center", paddingTop: 4 },
  tips: { gap: 16, paddingTop: 12 },
  tip: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tipNumberLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    includeFontPadding: false,
  },
  tipCopy: { flex: 1, gap: 2 },
  tipTitle: { fontSize: 15, includeFontPadding: false },
  tipBody: { fontSize: 13, lineHeight: 19, includeFontPadding: false },
});
