import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  Menu,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

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
  const theme = useTheme();
  const [form, setForm] = useState<AvatarInput>(
    initialValue ?? EMPTY_AVATAR_INPUT,
  );
  const [genderMenuOpen, setGenderMenuOpen] = useState(false);

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

  const genderLabel =
    form.gender?.trim() ||
    t("avatars.form.genderUnspecified");

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.ScrollArea style={styles.scrollArea}>
        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            label={t("avatars.form.name")}
            value={form.name}
            onChangeText={setField("name")}
            mode="outlined"
            error={nameInvalid}
            style={styles.input}
          />
          {nameInvalid ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              {t("avatars.form.notAppropriate")}
            </Text>
          ) : null}
          <TextInput
            label={t("avatars.form.relationship")}
            placeholder={t("avatars.form.relationshipPlaceholder")}
            value={form.relationship ?? ""}
            onChangeText={setField("relationship")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.age")}
            value={form.age === undefined ? "" : String(form.age)}
            onChangeText={setField("age")}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
          />
          <Menu
            visible={genderMenuOpen}
            onDismiss={() => setGenderMenuOpen(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setGenderMenuOpen(true)}
                style={styles.input}
                contentStyle={styles.genderButton}
              >
                {t("avatars.form.gender")}: {genderLabel}
              </Button>
            }
          >
            <Menu.Item
              title={t("avatars.form.genderUnspecified")}
              onPress={() => {
                setField("gender")("");
                setGenderMenuOpen(false);
              }}
            />
            {GENDER_OPTIONS.map((option) => (
              <Menu.Item
                key={option}
                title={option}
                onPress={() => {
                  setField("gender")(option);
                  setGenderMenuOpen(false);
                }}
              />
            ))}
          </Menu>
          <TextInput
            label={t("avatars.form.skinTone")}
            placeholder={t("avatars.form.skinTonePlaceholder")}
            value={form.skinTone ?? ""}
            onChangeText={setField("skinTone")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.eyeColor")}
            placeholder={t("avatars.form.eyeColorPlaceholder")}
            value={form.eyeColor ?? ""}
            onChangeText={setField("eyeColor")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.hairColor")}
            placeholder={t("avatars.form.hairColorPlaceholder")}
            value={form.hairColor ?? ""}
            onChangeText={setField("hairColor")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.hairStyle")}
            placeholder={t("avatars.form.hairStylePlaceholder")}
            value={form.hairStyle ?? ""}
            onChangeText={setField("hairStyle")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.outfit")}
            placeholder={t("avatars.form.outfitPlaceholder")}
            value={form.outfit ?? ""}
            onChangeText={setField("outfit")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.feature")}
            placeholder={t("avatars.form.featurePlaceholder")}
            value={form.distinguishingFeature ?? ""}
            onChangeText={setField("distinguishingFeature")}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("avatars.form.notes")}
            placeholder={t("avatars.form.notesPlaceholder")}
            value={form.notes ?? ""}
            onChangeText={setField("notes")}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={onDismiss} disabled={isSaving}>
          {t("avatars.form.cancel")}
        </Button>
        <Button loading={isSaving} onPress={handleSubmit} disabled={!canSave}>
          {isSaving ? t("avatars.form.saving") : t("avatars.form.save")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  scrollArea: { paddingHorizontal: 0, maxHeight: 420 },
  form: { paddingHorizontal: 24, paddingBottom: 8 },
  input: { marginBottom: 8 },
  genderButton: { justifyContent: "flex-start" },
});
