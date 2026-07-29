import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { DELETE_ACCOUNT_CONFIRMATION_PHRASE } from "@yasserzakywafaa/client-core";

import { LocalePortalBoundary } from "src/components/layout/LocalePortalBoundary";
import { useThemedTextInputProps, useScreenTypography } from "src/components/layout/useScreenTypography";

export interface DeleteAccountDialogProps {
  visible: boolean;
  isDeleting: boolean;
  impactItems: string[];
  onDismiss: () => void;
  onConfirm: (confirmationPhrase: string) => void;
}

export const DeleteAccountDialog = ({
  visible,
  isDeleting,
  impactItems,
  onDismiss,
  onConfirm,
}: DeleteAccountDialogProps) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const inputProps = useThemedTextInputProps();
  const typography = useScreenTypography();

  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const isPhraseMatch =
    confirmationPhrase.trim() === DELETE_ACCOUNT_CONFIRMATION_PHRASE;
  const canDelete = hasAcknowledged && isPhraseMatch && !isDeleting;

  useEffect(() => {
    if (!visible) {
      setHasAcknowledged(false);
      setConfirmationPhrase("");
    }
  }, [visible]);

  const handleDismiss = () => {
    if (isDeleting) {
      return;
    }
    onDismiss();
  };

  const checkboxColor = hasAcknowledged
    ? theme.colors.primary
    : theme.colors.onSurfaceVariant;

  return (
    <LocalePortalBoundary>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title style={typography.title}>{t("profile.deleteAccount")}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text variant="bodyMedium" style={typography.body}>
              {t("profile.deleteAccountIntro")}
            </Text>

            <View style={styles.list}>
              {impactItems.map((item, index) => (
                <Text
                  key={`${index}-${item}`}
                  variant="bodyMedium"
                  style={[styles.listItem, typography.body]}
                >
                  • {item}
                </Text>
              ))}
            </View>

            <Pressable
              style={styles.ackRow}
              onPress={() => {
                if (!isDeleting) {
                  setHasAcknowledged((prev) => !prev);
                }
              }}
              disabled={isDeleting}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hasAcknowledged, disabled: isDeleting }}
            >
              <View style={styles.checkboxIconWrap}>
                <MaterialCommunityIcons
                  name={
                    hasAcknowledged ? "checkbox-marked" : "checkbox-blank-outline"
                  }
                  size={26}
                  color={checkboxColor}
                />
              </View>
              <Text
                variant="bodyMedium"
                style={[styles.ackLabel, typography.body]}
              >
                {t("profile.deleteAcknowledge")}
              </Text>
            </Pressable>

            <TextInput
              mode="outlined"
              label={t("profile.typeConfirmationPhrase")}
              value={confirmationPhrase}
              onChangeText={setConfirmationPhrase}
              disabled={isDeleting}
              placeholder={DELETE_ACCOUNT_CONFIRMATION_PHRASE}
              autoCapitalize="none"
              autoCorrect={false}
              {...inputProps}
            />
            <Text variant="bodySmall" style={[typography.body, { marginTop: 4 }]}>
              {t("profile.typeToConfirm", {
                phrase: DELETE_ACCOUNT_CONFIRMATION_PHRASE,
              })}
            </Text>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss} disabled={isDeleting}>
            {t("profile.keepMyAccount")}
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            onPress={() => onConfirm(confirmationPhrase.trim())}
            disabled={!canDelete}
            loading={isDeleting}
          >
            {isDeleting
              ? t("profile.deleting")
              : t("profile.deleteAccountForever")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </LocalePortalBoundary>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 0,
    maxHeight: 360,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  list: {
    marginTop: 4,
    gap: 4,
  },
  listItem: {
    paddingStart: 4,
  },
  ackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
  },
  checkboxIconWrap: {
    marginTop: 2,
  },
  ackLabel: {
    flex: 1,
    paddingTop: 6,
  },
});
