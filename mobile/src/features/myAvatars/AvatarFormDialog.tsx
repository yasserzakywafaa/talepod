import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog, TextInput } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { SelectField } from "src/components/brand/SelectField";
import {
  EMPTY_AVATAR_INPUT,
  type AvatarInput,
} from "src/shared/types/avatar";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";

const GENDER_OPTIONS = ["Boy", "Girl", "Male", "Female", "Other"] as const;

export type AvatarFormDialogProps = {
  visible: boolean;
  title: string;
  initialValue?: AvatarInput;
  isSaving?: boolean;
  onDismiss: () => void;
  onSubmit: (input: AvatarInput) => void;
};

export const AvatarFormDialog = ({
  visible,
  title,
  initialValue,
  isSaving,
  onDismiss,
  onSubmit,
}: AvatarFormDialogProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const [form, setForm] = useState<AvatarInput>(
    initialValue ?? EMPTY_AVATAR_INPUT,
  );

  useEffect(() => {
    if (visible) {
      setForm(initialValue ?? EMPTY_AVATAR_INPUT);
    }
  }, [visible, initialValue]);

  const nameInvalid = hasCensoredWords(form.name);
  const canSave = Boolean(form.name.trim()) && !nameInvalid && !isSaving;

  const setField =
    (field: keyof AvatarInput) => (value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "age"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      }));
    };

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({ ...form, name: form.name.trim() });
  };

  // Outlined Paper fields fill with `colors.background`; inside a dialog that
  // is the page colour, not the dialog's, so the surface is set explicitly.
  const fieldProps = {
    mode: "outlined" as const,
    style: [styles.input, { backgroundColor: theme.colors.surface }],
    outlineStyle: { borderRadius: theme.tokens.radius.md },
    outlineColor: theme.colors.outlineVariant,
    activeOutlineColor: theme.colors.primary,
    textColor: theme.colors.onSurface,
  };

  /** Trait fields rendered after gender — `field` is the form key, `label` the i18n stem. */
  const TRAIT_FIELDS = [
    { field: "skinTone", label: "skinTone" },
    { field: "eyeColor", label: "eyeColor" },
    { field: "hairColor", label: "hairColor" },
    { field: "hairStyle", label: "hairStyle" },
    { field: "outfit", label: "outfit" },
    { field: "distinguishingFeature", label: "feature" },
  ] as const;

  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={[
        styles.dialog,
        {
          borderRadius: theme.tokens.radius.lg,
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <Dialog.Title>
        <DisplayText size={22}>{title}</DisplayText>
      </Dialog.Title>

      <Dialog.ScrollArea style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            label={t("avatars.form.name")}
            value={form.name}
            onChangeText={setField("name")}
            error={nameInvalid}
            {...fieldProps}
          />
          {nameInvalid ? (
            <Text
              style={[
                styles.error,
                {
                  color: theme.colors.error,
                  fontFamily: theme.tokens.fontFamily.medium,
                },
              ]}
            >
              {t("avatars.form.notAppropriate")}
            </Text>
          ) : null}

          <TextInput
            label={t("avatars.form.relationship")}
            placeholder={t("avatars.form.relationshipPlaceholder")}
            value={form.relationship ?? ""}
            onChangeText={setField("relationship")}
            {...fieldProps}
          />

          <TextInput
            label={t("avatars.form.age")}
            value={form.age === undefined ? "" : String(form.age)}
            onChangeText={setField("age")}
            keyboardType="number-pad"
            {...fieldProps}
          />

          <View style={styles.input}>
            <SelectField
              label={t("avatars.form.gender")}
              surfaceColor={theme.colors.surface}
              value={form.gender ?? ""}
              options={[
                { value: "", label: t("avatars.form.genderUnspecified") },
                ...GENDER_OPTIONS.map((option) => ({
                  value: option as string,
                  label: option,
                })),
              ]}
              onChange={(value) => setField("gender")(value)}
            />
          </View>

          {TRAIT_FIELDS.map(({ field, label }) => (
            <TextInput
              key={field}
              label={t(`avatars.form.${label}`)}
              placeholder={t(`avatars.form.${label}Placeholder`)}
              value={(form[field] as string | undefined) ?? ""}
              onChangeText={setField(field)}
              {...fieldProps}
            />
          ))}

          <TextInput
            label={t("avatars.form.notes")}
            placeholder={t("avatars.form.notesPlaceholder")}
            value={form.notes ?? ""}
            onChangeText={setField("notes")}
            multiline
            numberOfLines={3}
            {...fieldProps}
          />
        </ScrollView>
      </Dialog.ScrollArea>

      <Dialog.Actions style={styles.actions}>
        <PillButton
          variant="text"
          compact
          onPress={onDismiss}
          disabled={isSaving}
          color={theme.colors.onSurfaceVariant}
        >
          {t("avatars.form.cancel")}
        </PillButton>
        <PillButton
          compact
          loading={isSaving}
          onPress={handleSubmit}
          disabled={!canSave}
        >
          {isSaving ? t("avatars.form.saving") : t("avatars.form.save")}
        </PillButton>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: { borderWidth: 1 },
  scrollArea: { paddingHorizontal: 0, maxHeight: 420 },
  form: { paddingHorizontal: 24, paddingBottom: 8, paddingTop: 4 },
  input: { marginBottom: 12 },
  error: { fontSize: 12, marginBottom: 8, includeFontPadding: false },
  actions: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
});
