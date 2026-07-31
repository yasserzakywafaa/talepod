import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { ChoiceChip } from "src/components/brand/ChoiceChip";
import { DisplayText } from "src/components/brand/DisplayText";
import { MultiSelectField } from "src/components/brand/MultiSelectField";
import { PillButton } from "src/components/brand/PillButton";
import { SectionLabel } from "src/components/brand/SectionLabel";
import { AdultGenderEnum } from "src/features/storyCreator/store/state";
import { Languages } from "src/shared/languages";
import { Environments } from "src/shared/storyOptions/Environments";
import { Morals } from "src/shared/storyOptions/Moral";
import { Tones } from "src/shared/storyOptions/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";

/** The filter fields Library and My Stories have in common, plus `createdByAdmin`. */
export type StoryFilterValues = {
  name?: string;
  gender?: string;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  audio?: boolean;
  createdByAdmin?: boolean;
};

export type StoryFilterKey = keyof StoryFilterValues;
export type StoryFilterValue = StoryFilterValues[StoryFilterKey];

type StoryFiltersSheetProps = {
  visible: boolean;
  values: StoryFilterValues;
  /**
   * Only My Stories exposes the "TalePod Originals" toggle. When false the
   * sheet never emits `createdByAdmin`.
   */
  showOriginals?: boolean;
  onChange: (key: StoryFilterKey, value: StoryFilterValue) => void;
  onApply: () => void;
  onClear: () => void;
  onDismiss: () => void;
};

/** Ages offered in the picker — matches the web filter panel's 1–50 range. */
const AGES = Array.from({ length: 50 }, (_, index) => index + 1);

/**
 * Filter sheet for the story lists — the native read of the web
 * `FiltersPanel` drawer. Multi-selects become chip groups, which suit touch
 * better than menus and match the language of the create form.
 */
export const StoryFiltersSheet = ({
  visible,
  values,
  showOriginals = false,
  onChange,
  onApply,
  onClear,
  onDismiss,
}: StoryFiltersSheetProps) => {
  const { t } = useTranslation("library");
  const { t: tStory } = useTranslation("story");
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { radius, fontFamily, shadow } = theme.tokens;

  const nameInvalid = hasCensoredWords(values.name ?? "");

  const toggleRow = (
    label: string,
    checked: boolean,
    onToggle: (next: boolean) => void,
  ) => (
    <View style={styles.switchRow}>
      <Text
        style={[
          styles.switchLabel,
          {
            color: theme.colors.onSurface,
            fontFamily: fontFamily.medium,
          },
        ]}
      >
        {label}
      </Text>
      <Switch
        value={checked}
        onValueChange={onToggle}
        trackColor={{ true: theme.colors.primary }}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, { backgroundColor: theme.colors.backdrop }]}>
        <Pressable
          style={styles.dismissArea}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t("filters.cancel")}
        />

        <View
          style={[
            styles.sheet,
            shadow.lg,
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={styles.grabberWrap}>
            <View
              style={[
                styles.grabber,
                { backgroundColor: theme.colors.outlineVariant },
              ]}
            />
          </View>

          <View style={styles.header}>
            <DisplayText size={22} color={theme.colors.primary}>
              {t("filters.title")}
            </DisplayText>
            <Pressable
              onPress={onDismiss}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("filters.cancel")}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              label={t("filters.name")}
              value={values.name ?? ""}
              onChangeText={(next) => onChange("name", next)}
              mode="outlined"
              error={nameInvalid}
              outlineStyle={{ borderRadius: radius.md }}
              style={{ backgroundColor: theme.colors.background }}
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
            />
            {nameInvalid ? (
              <Text
                style={[
                  styles.error,
                  {
                    color: theme.colors.error,
                    fontFamily: fontFamily.medium,
                  },
                ]}
              >
                {t("filters.notAppropriate")}
              </Text>
            ) : null}

            <View style={styles.section}>
              <SectionLabel>{tStory("avatars.form.gender")}</SectionLabel>
              <View style={styles.chipRow}>
                {[AdultGenderEnum.Male, AdultGenderEnum.Female].map((gender) => (
                  <ChoiceChip
                    key={gender}
                    label={gender}
                    selected={values.gender === gender}
                    // Tapping the active option clears it — the web toggle
                    // group is exclusive but also deselectable.
                    onPress={() =>
                      onChange("gender", values.gender === gender ? "" : gender)
                    }
                  />
                ))}
              </View>
            </View>

            <MultiSelectField
              label={t("filters.language")}
              values={values.language}
              options={Languages.map((language) => ({
                value: language.value as string,
                label: language.name,
              }))}
              onChange={(next) => onChange("language", next)}
            />

            <MultiSelectField
              label={t("filters.age")}
              values={values.age}
              options={AGES.map((age) => ({ value: age, label: String(age) }))}
              onChange={(next) => onChange("age", next)}
              compactOptions
            />

            <MultiSelectField
              label={tStory("form.settings.moral")}
              values={values.moral}
              options={Morals.map((moral) => ({
                value: moral.value,
                label: moral.name,
              }))}
              onChange={(next) => onChange("moral", next)}
            />

            <MultiSelectField
              label={tStory("form.settings.tone")}
              values={values.tone}
              options={Tones.map((tone) => ({
                value: tone.value,
                label: tone.name,
              }))}
              onChange={(next) => onChange("tone", next)}
            />

            <MultiSelectField
              label={tStory("form.settings.environment")}
              values={values.environment}
              options={Environments.map((environment) => ({
                value: environment.value,
                label: environment.name,
              }))}
              onChange={(next) => onChange("environment", next)}
            />

            <View style={styles.section}>
              {toggleRow(t("filters.storyAudio"), Boolean(values.audio), (next) =>
                onChange("audio", next || undefined),
              )}
              {showOriginals
                ? toggleRow(
                    t("filters.originals"),
                    Boolean(values.createdByAdmin),
                    (next) => onChange("createdByAdmin", next || undefined),
                  )
                : null}
            </View>
          </ScrollView>

          <View
            style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}
          >
            <PillButton
              variant="text"
              compact
              onPress={onDismiss}
              color={theme.colors.onSurfaceVariant}
            >
              {t("filters.cancel")}
            </PillButton>
            <View style={styles.footerActions}>
              <PillButton variant="outlined" compact onPress={onClear}>
                {t("filters.clear")}
              </PillButton>
              <PillButton compact onPress={onApply} disabled={nameInvalid}>
                {t("filters.apply")}
              </PillButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  dismissArea: { flex: 1, minHeight: 64 },
  sheet: { maxHeight: "88%", overflow: "hidden" },
  grabberWrap: { alignItems: "center", paddingTop: 8 },
  grabber: { width: 40, height: 4, borderRadius: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 20 },
  section: { gap: 10 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  error: { fontSize: 12, includeFontPadding: false },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 40,
  },
  switchLabel: { flex: 1, fontSize: 15, includeFontPadding: false },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
});
