import { useTranslation } from "react-i18next";
import { Button, Dialog, Text } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { LocalePortalBoundary } from "src/components/layout/LocalePortalBoundary";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type ConfirmDestructiveDialogProps = {
  visible: boolean;
  title: string;
  /** Already-interpolated body copy — the web renders the name in bold here. */
  message: string;
  confirmLabel?: string;
  isBusy?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * The delete confirmations from the web dashboard (`deleteUserDialog`,
 * `deleteStoryDialog`), which are MUI `Dialog`s — so this is Paper's `Dialog`
 * with the same three parts: icon-led title, one-line warning, cancel/confirm.
 */
export const ConfirmDestructiveDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  isBusy = false,
  onConfirm,
  onDismiss,
}: ConfirmDestructiveDialogProps) => {
  const { t } = useTranslation("common");
  const theme = useAppTheme();
  const typography = useScreenTypography();

  return (
    <LocalePortalBoundary>
      <Dialog visible={visible} onDismiss={isBusy ? () => {} : onDismiss}>
        <Dialog.Icon icon="delete-outline" color={theme.colors.error} />
        <Dialog.Title style={typography.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={typography.body}>
            {message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={isBusy}>
            {t("cancel")}
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            icon="delete-outline"
            loading={isBusy}
            disabled={isBusy}
            onPress={onConfirm}
          >
            {confirmLabel ?? t("delete")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </LocalePortalBoundary>
  );
};
