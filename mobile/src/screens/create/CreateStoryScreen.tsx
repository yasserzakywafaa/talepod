import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Chip,
  List,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import {
  openRootSheet,
  navigateToMainMyStories,
  rootNavigationRef,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { AppButton } from "src/components/paper/AppButton";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
import { Page } from "src/components/layout/Page";
import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import {
  useBrandButtonColors,
  useThemedTextInputProps,
} from "src/components/layout/useScreenTypography";
import { useGenerateStory } from "src/features/storyCreator/hooks/useGenerateStory";
import { useAvatarsList } from "src/features/storyCreator/hooks/useAvatarsList";
import { useStoryCreatorContext } from "src/features/storyCreator/store/Provider";
import { getCreateStoryErrorMessage } from "src/features/storyCreator/openai/useCreateStory";
import {
  AdultGenderEnum,
  ChildGenderEnum,
  type StoryFormat,
} from "src/features/storyCreator/store/state";
import { ArtStyles } from "src/shared/artStyles";
import { Languages, type Language } from "src/shared/languages";
import { Environments } from "src/shared/mockedData/Environments";
import { Morals } from "src/shared/mockedData/Moral";
import { Tones } from "src/shared/mockedData/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { saveCreateDraft } from "src/shared/utils/authReturn";
import { UserRole, UserStatus } from "src/shared/types/user";

type Props = {
  embeddedInMainShell?: boolean;
} & Partial<
  NativeStackScreenProps<
    RootStackParamList,
    typeof mobileRoutes.authenticated.create
  >
>;

export const CreateStoryScreen = ({
  navigation,
  embeddedInMainShell,
}: Props) => {
  const { t } = useTranslation("story");
  const theme = useTheme();
  const inputProps = useThemedTextInputProps();
  const brand = useBrandButtonColors();
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
  const { avatars, isLoading: avatarsLoading } = useAvatarsList(
    auth.isAuthenticated,
  );

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
      rootNavigationRef.navigate(rootRoutes.main, {
        screen: mobileRoutes.main.shell,
        params: { screen: mobileRoutes.public.pricing },
      });
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

  const formatButtons = [
    { value: "comic", label: t("form.format.comic.title") },
    { value: "long", label: t("form.format.long.title") },
  ];

  const shellDrawer = useMainShellDrawer();
  const drawerNavigation = embeddedInMainShell ? shellDrawer : undefined;

  const body = (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t("createPage.subheading")}
      </Text>

      <TextInput
        label={t("form.nameLabel")}
        value={profileInfo.name}
        onChangeText={(v) => handleUpdateProfileInfo("name", v)}
        mode="outlined"
        {...inputProps}
        error={hasCensoredWords(profileInfo.name)}
      />

      <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
        Gender
      </Text>
      <View style={styles.chipRow}>
        {genders.map((g) => (
          <Chip
            key={g}
            selected={profileInfo.gender === g}
            onPress={() => handleUpdateProfileInfo("gender", g)}
          >
            {g}
          </Chip>
        ))}
      </View>

      <TextInput
        label={t("form.ageLabel")}
        value={String(profileInfo.age)}
        onChangeText={(v) => {
          const n = parseInt(v, 10);
          if (!Number.isNaN(n)) handleUpdateProfileInfo("age", n);
        }}
        keyboardType="number-pad"
        mode="outlined"
        {...inputProps}
      />

      <Text variant="labelLarge">{t("form.languageLabel")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {Languages.map((lang) => (
            <Chip
              key={lang.value}
              selected={profileInfo.language.value === lang.value}
              onPress={() =>
                handleUpdateProfileInfo("language", lang as Language)
              }
            >
              {lang.name}
            </Chip>
          ))}
        </View>
      </ScrollView>

      <Text variant="labelLarge">Format</Text>
      <SegmentedButtons
        value={format}
        onValueChange={(v) => handleSetFormat(v as StoryFormat)}
        buttons={formatButtons}
      />

      <Text variant="labelLarge">{t("form.artStyleLabel")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {ArtStyles.map((style) => (
            <Pressable
              key={style.id}
              onPress={() => handleSetArtStyle(style.id)}
              style={[
                styles.artTile,
                {
                  borderColor:
                    artStyle === style.id
                      ? theme.colors.primary
                      : theme.colors.outline,
                  backgroundColor: style.swatchColor,
                },
              ]}
            >
              <Text variant="labelSmall">{style.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {auth.isAuthenticated ? (
        <>
          <Text variant="labelLarge">{t("avatars.picker.title")}</Text>
          {avatarsLoading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                <Chip
                  selected={!avatarId}
                  onPress={() => handleSelectAvatar(null)}
                >
                  {t("avatars.picker.none")}
                </Chip>
                {avatars.map((a) => (
                  <Chip
                    key={a._id}
                    selected={avatarId === a._id}
                    onPress={() => handleSelectAvatar(a)}
                    avatar={
                      a.portraitUrl ? (
                        <Image
                          source={{ uri: a.portraitUrl }}
                          style={styles.avatarThumb}
                        />
                      ) : undefined
                    }
                  >
                    {a.name}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          )}
        </>
      ) : null}

      <List.Accordion
        title={t("form.moreSettings")}
        expanded={settingsOpen}
        onPress={() => setSettingsOpen((o) => !o)}
      >
        <View style={styles.settings}>
          <Text variant="labelMedium">{t("form.settings.moral")}</Text>
          <View style={styles.chipRow}>
            {Morals.slice(0, 8).map((m) => (
              <Chip
                key={m.value}
                selected={storyParams.moral.value === m.value}
                onPress={() => handleUpdateStoryInfo("moral", m)}
              >
                {m.name}
              </Chip>
            ))}
          </View>
          <Text variant="labelMedium">{t("form.settings.tone")}</Text>
          <View style={styles.chipRow}>
            {Tones.slice(0, 6).map((tone) => (
              <Chip
                key={tone.value}
                selected={storyParams.tone.value === tone.value}
                onPress={() => handleUpdateStoryInfo("tone", tone)}
              >
                {tone.name}
              </Chip>
            ))}
          </View>
          <Text variant="labelMedium">{t("form.settings.environment")}</Text>
          <View style={styles.chipRow}>
            {Environments.slice(0, 6).map((env) => (
              <Chip
                key={env.value}
                selected={storyParams.environment.value === env.value}
                onPress={() => handleUpdateStoryInfo("environment", env)}
              >
                {env.name}
              </Chip>
            ))}
          </View>
          <TextInput
            label={t("form.settings.interests")}
            value={profileInfo.interests}
            onChangeText={(v) => handleUpdateProfileInfo("interests", v)}
            mode="outlined"
            {...inputProps}
          />
        </View>
      </List.Accordion>

      {hasMaxStoriesLimit ? (
        <Text style={{ color: theme.colors.error }}>
          {t("form.alerts.limitReached", {
            max: user?.subscription.maxStoriesAllowed ?? 0,
          })}
        </Text>
      ) : null}

      <AppButton
        mode="contained"
        buttonColor={brand.contained}
        textColor={brand.onContained}
        disabled={submitDisabled}
        loading={isCreatingStory}
        onPress={() => void onSubmit()}
      >
        {ctaLabel}
      </AppButton>
    </ScrollView>
  );

  if (embeddedInMainShell && drawerNavigation) {
    return (
      <Page
        header={
          <MainShellAppBar
            navigation={drawerNavigation}
            title={t("createPage.heading")}
          />
        }
      >
        <View
          style={[styles.root, { backgroundColor: theme.colors.background }]}
        >
          {body}
          <Snackbar
            visible={errorMessage !== null}
            onDismiss={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Snackbar>
        </View>
      </Page>
    );
  }

  return (
    <Page
      header={
        navigation ? (
          <View style={styles.topBar}>
            <AppButton mode="text" onPress={() => navigation.goBack()}>
              {t("common:back", { ns: "common" })}
            </AppButton>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {t("createPage.heading")}
            </Text>
            <View style={styles.topBarSpacer} />
          </View>
        ) : undefined
      }
    >
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        {body}
        <Snackbar
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Snackbar>
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  topBarSpacer: { width: 64 },
  scroll: { padding: 16, gap: 12, paddingBottom: 40 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  artTile: {
    width: 100,
    height: 72,
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    justifyContent: "flex-end",
  },
  avatarThumb: { width: 24, height: 24, borderRadius: 12 },
  settings: { gap: 8, paddingBottom: 8 },
});
