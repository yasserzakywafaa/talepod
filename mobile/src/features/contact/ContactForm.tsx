import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-paper";

import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import { useApplicationContext } from "src/application/store/Provider";
import { AppButton } from "src/components/chrome/AppButton";
import { AppToast } from "src/components/chrome/AppToast";
import { useThemedTextInputProps } from "src/components/layout/useScreenTypography";
import { submitContactForm } from "src/features/contact/submitContactForm";
import {
  emptyContactForm,
  type ContactFormState,
} from "src/features/contact/types";
import type { User } from "src/shared/types/user";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildDefaultForm = (
  user: User | null,
  initialValues?: Partial<ContactFormState>,
): ContactFormState => {
  const nameFromUser = user
    ? [user.name.givenName, user.name.familyName].filter(Boolean).join(" ")
    : "";

  return {
    ...emptyContactForm(),
    name: nameFromUser,
    email: user?.email ?? "",
    ...initialValues,
  };
};

type ContactFormProps = {
  initialValues?: Partial<ContactFormState>;
};

export const ContactForm = ({ initialValues }: ContactFormProps) => {
  const { t } = useTranslation(["page", "common"]);
  const inputProps = useThemedTextInputProps();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const [form, setForm] = useState<ContactFormState>(() =>
    buildDefaultForm(auth.user, initialValues),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const updateField = (key: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (
      !trimmed.name ||
      !trimmed.email ||
      !trimmed.subject ||
      !trimmed.message
    ) {
      return t("contact.validationRequired");
    }

    if (!EMAIL_PATTERN.test(trimmed.email)) {
      return t("contact.validationEmail");
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setToast({ message: validationError, variant: "error" });
      return;
    }

    const payload: ContactFormState = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    setIsSubmitting(true);
    try {
      await submitContactForm(payload);
      Keyboard.dismiss();
      setForm(buildDefaultForm(auth.user, initialValues));
      setToast({
        message: t("emailSentSuccess", { ns: "common" }),
        variant: "success",
      });
    } catch (error) {
      setToast({
        message: getApiErrorMessage(
          error,
          t("contact.sendFailed"),
          t("contact.networkError"),
        ),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label={t("contact.name")}
          value={form.name}
          onChangeText={(value) => updateField("name", value)}
          autoComplete="name"
          {...inputProps}
        />
        <TextInput
          mode="outlined"
          label={t("contact.email")}
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          {...inputProps}
        />
        <TextInput
          mode="outlined"
          label={t("contact.subject")}
          value={form.subject}
          onChangeText={(value) => updateField("subject", value)}
          {...inputProps}
        />
        <TextInput
          mode="outlined"
          label={t("contact.message")}
          value={form.message}
          onChangeText={(value) => updateField("message", value)}
          multiline
          numberOfLines={5}
          style={styles.messageInput}
          {...inputProps}
        />
        <AppButton
          mode="contained"
          icon="send"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={() => void handleSubmit()}
        >
          {t("contact.sendMessage")}
        </AppButton>
      </View>

      <AppToast
        visible={toast !== null}
        message={toast?.message ?? ""}
        variant={toast?.variant ?? "success"}
        duration={toast?.variant === "error" ? 5000 : 3500}
        onDismiss={() => setToast(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginTop: 8,
  },
  messageInput: {
    minHeight: 120,
  },
});
