import { useMemo, useState } from "react";
import { Platform, StyleSheet, Text as RNText, View } from "react-native";
import type { TextInputProps } from "react-native";
import { useTranslation } from "react-i18next";
import { Text, TextInput, useTheme } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import type { CountryCode } from "react-native-country-picker-modal";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import { mobileApiHeaders } from "src/application/auth/mobileApiHeaders";
import { AuthSelectField } from "src/components/auth/AuthSelectField";
import { AuthSocialButton } from "src/components/auth/AuthSocialButton";
import {
  useScreenTypography,
  useThemedTextInputProps,
} from "src/components/layout/useScreenTypography";
import { useApplicationContext } from "src/application/store/Provider";
import type { User } from "src/shared/types/user";
import { countryCodeToFlagEmoji } from "src/shared/utils/countryCodeToFlagEmoji";
import { validatePhoneNumber } from "src/shared/utils/validatePhoneNumber";

const OTP_CODE_REGEX = /^\d{4,8}$/;
const PREFERRED_COUNTRIES: CountryCode[] = ["DE", "FR", "EG", "PT"];
const PHONE_INPUT_MIN_HEIGHT = Platform.OS === "android" ? 58 : 56;

type PhoneAuthType = "register" | "login";

type PhoneVerifyResponse = {
  message: string;
  user: User;
  accessToken?: string;
  refreshToken?: string;
};

type PhoneOtpAuthFormProps = {
  authType: PhoneAuthType;
  onSuccess: (user: User) => void;
  onWaitingForOtp?: (waiting: boolean) => void;
};

export const PhoneOtpAuthForm = ({
  authType,
  onSuccess,
  onWaitingForOtp,
}: PhoneOtpAuthFormProps) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const typography = useScreenTypography();
  const inputProps = useThemedTextInputProps();

  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const isRegister = authType === "register";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendOtpEndpoint = useMemo(
    () =>
      isRegister
        ? END_POINTS.AUTH.PHONE_REGISTER_SEND_OTP
        : END_POINTS.AUTH.PHONE_LOGIN_SEND_OTP,
    [isRegister],
  );

  const verifyOtpEndpoint = useMemo(
    () =>
      isRegister
        ? END_POINTS.AUTH.PHONE_REGISTER_VERIFY_OTP
        : END_POINTS.AUTH.PHONE_LOGIN_VERIFY_OTP,
    [isRegister],
  );

  const genderOptions = useMemo(
    () => [
      { value: "male", label: t("genderMale") },
      { value: "female", label: t("genderFemale") },
      { value: "other", label: t("genderOther") },
      { value: "prefer_not_to_say", label: t("genderPreferNot") },
    ],
    [t],
  );

  const languageOptions = useMemo(
    () => [
      { value: "en", label: t("languageEnglish") },
      { value: "fr", label: t("languageFrench") },
      { value: "de", label: t("languageGerman") },
      { value: "ar", label: t("languageArabic") },
    ],
    [t],
  );

  const handleSendOtp = async () => {
    const normalizedPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!normalizedPhoneNumber) {
      setErrorMessage(t("validationPhoneRequired"));
      return;
    }

    if (isRegister && !firstName.trim()) {
      setErrorMessage(t("validationFirstNameRequired"));
      return;
    }

    if (isRegister && !gender.trim()) {
      setErrorMessage(t("validationGenderRequired"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post(
        sendOtpEndpoint,
        { phoneNumber: normalizedPhoneNumber },
        { headers: mobileApiHeaders },
      );
      setPhoneNumber(normalizedPhoneNumber);
      setSubmittedPhoneNumber(normalizedPhoneNumber);
      setIsOtpSent(true);
      setOtpCode("");
      onWaitingForOtp?.(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t("errorSendOtpConfig")));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!OTP_CODE_REGEX.test(otpCode.trim())) {
      setErrorMessage(t("validationOtpRequired"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = isRegister
        ? {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender: gender.trim(),
            language: language.trim() || undefined,
          }
        : {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
          };

      const response = await api.post<PhoneVerifyResponse>(
        verifyOtpEndpoint,
        payload,
        { headers: mobileApiHeaders },
      );

      const { user, accessToken, refreshToken } = response.data;
      if (!accessToken || !refreshToken) {
        throw new Error("Mobile phone auth response missing tokens");
      }

      await handleSetAuthInfo(
        { isAuthenticated: true, user },
        { accessToken, refreshToken },
      );
      onWaitingForOtp?.(false);
      onSuccess(user);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, t("errorOtpVerificationFailed")),
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePhoneNumber = () => {
    setIsOtpSent(false);
    setOtpCode("");
    setSubmittedPhoneNumber("");
    onWaitingForOtp?.(false);
  };

  return (
    <View style={styles.form}>
      {isRegister ? (
        <View style={styles.group}>
          <TextInput
            mode="outlined"
            label={t("firstName")}
            value={firstName}
            onChangeText={setFirstName}
            editable={!isOtpSent}
            {...inputProps}
          />
          <TextInput
            mode="outlined"
            label={t("lastName")}
            value={lastName}
            onChangeText={setLastName}
            editable={!isOtpSent}
            {...inputProps}
          />
          <AuthSelectField
            label={t("gender")}
            value={gender}
            options={genderOptions}
            onChange={setGender}
            disabled={isOtpSent}
            required
            inputProps={inputProps}
          />
          <AuthSelectField
            label={t("language")}
            value={language}
            options={languageOptions}
            onChange={setLanguage}
            disabled={isOtpSent}
            inputProps={inputProps}
          />
        </View>
      ) : null}

      <View
        style={[
          styles.phoneField,
          {
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
            minHeight: PHONE_INPUT_MIN_HEIGHT,
          },
        ]}
      >
        <PhoneInput
          defaultCode="PT"
          layout="first"
          disabled={isOtpSent}
          value={phoneNumber}
          onChangeFormattedText={setPhoneNumber}
          withDarkTheme={theme.dark}
          containerStyle={styles.phoneContainer}
          flagButtonStyle={styles.flagButton}
          countryPickerButtonStyle={styles.countryPickerButton}
          textContainerStyle={[
            styles.phoneTextContainer,
            { backgroundColor: theme.colors.surface },
          ]}
          textInputStyle={[
            styles.phoneTextInput,
            { color: theme.colors.onSurface },
          ]}
          codeTextStyle={[
            styles.phoneCodeText,
            { color: theme.colors.onSurface },
          ]}
          textInputProps={
            Platform.OS === "android"
              ? ({
                  includeFontPadding: false,
                  textAlignVertical: "center",
                } as TextInputProps)
              : undefined
          }
          countryPickerProps={{
            withFilter: true,
            withFlag: true,
            withEmoji: true,
            withAlphaFilter: true,
            preferredCountries: PREFERRED_COUNTRIES,
            containerButtonStyle: styles.countryPickerButton,
            flatListProps: { nestedScrollEnabled: true },
            renderFlagButton: ({
              countryCode,
            }: {
              countryCode?: CountryCode;
            }) =>
              countryCode ? (
                <RNText allowFontScaling={false} style={styles.countryFlag}>
                  {countryCodeToFlagEmoji(countryCode)}
                </RNText>
              ) : null,
          }}
          placeholder={t("phoneNumberPlaceholder")}
        />
      </View>

      {isOtpSent && (
        <>
          <TextInput
            mode="outlined"
            label={t("otpCode")}
            placeholder={t("otpPlaceholder")}
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            autoComplete="sms-otp"
            {...inputProps}
          />
          <Text variant="bodySmall" style={typography.body}>
            {t("otpSentTo", { number: submittedPhoneNumber })}
          </Text>
        </>
      )}

      {errorMessage ? (
        <Text variant="bodySmall" style={typography.error}>
          {errorMessage}
        </Text>
      ) : null}

      {!isOtpSent ? (
        <AuthSocialButton
          fullWidth={false}
          onPress={handleSendOtp}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? t("sendingOtp") : t("sendOtp")}
        </AuthSocialButton>
      ) : (
        <View style={styles.otpActions}>
          <AuthSocialButton
            fullWidth={false}
            mode="outlined"
            onPress={handleChangePhoneNumber}
            disabled={isSubmitting}
            buttonColor={theme.colors.surface}
          >
            {t("changeNumber")}
          </AuthSocialButton>
          <AuthSocialButton
            fullWidth={false}
            onPress={handleVerifyOtp}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting
              ? t("verifying")
              : isRegister
                ? t("verifyAndRegister")
                : t("verifyAndLogin")}
          </AuthSocialButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  group: {
    gap: 12,
  },
  phoneField: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
  },
  phoneContainer: {
    width: "100%",
    minHeight: PHONE_INPUT_MIN_HEIGHT,
    backgroundColor: "transparent",
  },
  flagButton: {
    // Overrides library default width: wp(20) (~20% of screen).
    width: 52,
    paddingLeft: 10,
    paddingRight: 0,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  countryPickerButton: {
    margin: 0,
    padding: 0,
    paddingRight: 0,
  },
  countryFlag: {
    fontSize: 22,
    lineHeight: 26,
  },
  phoneTextContainer: {
    minHeight: PHONE_INPUT_MIN_HEIGHT,
    paddingVertical: Platform.OS === "android" ? 8 : 12,
    paddingLeft: 4,
    paddingRight: 8,
    justifyContent: "center",
  },
  phoneTextInput: {
    fontSize: 16,
    lineHeight: Platform.OS === "android" ? 24 : 20,
    ...(Platform.OS === "android"
      ? { minHeight: 40, paddingVertical: 0 }
      : { height: 32 }),
  },
  phoneCodeText: {
    fontSize: 16,
    lineHeight: Platform.OS === "android" ? 24 : 20,
    marginRight: 6,
  },
  otpActions: {
    gap: 8,
    alignItems: "flex-start",
  },
});
