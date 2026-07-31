import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { ChoiceChip } from "src/components/brand/ChoiceChip";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { SectionLabel } from "src/components/brand/SectionLabel";
import { AdultGenderEnum } from "src/features/storyCreator/store/state";
import { Languages } from "src/shared/languages";
import { Environments } from "src/shared/mockedData/Environments";
import { Morals } from "src/shared/mockedData/Moral";
import { Tones } from "src/shared/mockedData/Tone";
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

/** Adds or removes `item`, leaving the original array untouched. */
const toggle = <T,>(list: T[], item: T): T[] =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];

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

            <View style={styles.section}>
              <SectionLabel>{t("filters.language")}</SectionLabel>
              <View style={styles.chipRow}>
                {Languages.map((language) => (
                  <ChoiceChip
                    key={language.value}
                    label={language.name}
                    selected={values.language.includes(language.value)}
                    onPress={() =>
                      onChange("language", toggle(values.language, language.value))
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionLabel>{t("filters.age")}</SectionLabel>
              <View style={styles.chipRow}>
                {AGES.map((age) => (
                  <ChoiceChip
                    key={age}
                    label={String(age)}
                    selected={values.age.includes(age)}
                    onPress={() => onChange("age", toggle(values.age, age))}
                  />
                ))}
              </View>
            </View>

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

            <View style={styles.section}>
              <SectionLabel>{tStory("form.settings.moral")}</SectionLabel>
              <View style={styles.chipRow}>
                {Morals.map((moral) => (
                  <ChoiceChip
                    key={moral.value}
                    label={moral.name}
                    selected={values.moral.includes(moral.value)}
                    onPress={() => onChange("moral", toggle(values.moral, moral.value))}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionLabel>{tStory("form.settings.tone")}</SectionLabel>
              <View style={styles.chipRow}>
                {Tones.map((tone) => (
                  <ChoiceChip
                    key={tone.value}
                    label={tone.name}
                    selected={values.tone.includes(tone.value)}
                    onPress={() => onChange("tone", toggle(values.tone, tone.value))}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionLabel>{tStory("form.settings.environment")}</SectionLabel>
              <View style={styles.chipRow}>
                {Environments.map((environment) => (
                  <ChoiceChip
                    key={environment.value}
                    label={environment.name}
                    selected={values.environment.includes(environment.value)}
                    onPress={() =>
                      onChange(
                        "environment",
                        toggle(values.environment, environment.value),
                      )
                    }
                  />
                ))}
              </View>
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
