import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { useMemo, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { MuiTelInput } from "mui-tel-input";
import { User } from "src/shared/types/user";
import axios from "axios";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { parsePhoneNumber } from "libphonenumber-js";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLocation, useNavigate } from "react-router-dom";
import { popCreateDraft, popReturnUrl } from "src/shared/utils/authReturn";

type PhoneAuthType = "register" | "login";

interface PhoneAuthSuccessResponse {
  message: string;
  user: User;
}

interface PhoneOtpAuthFormProps {
  authType: PhoneAuthType;
  onAuthSuccess?: () => void;
  onWaitingForOtp?: (waiting: boolean) => void;
}

const OTP_CODE_REGEX = /^\d{4,8}$/;

const validatePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = parsePhoneNumber(trimmed);
    if (!parsed?.isValid()) return null;
    return parsed.format("E.164");
  } catch {
    return null;
  }
};

const PhoneOtpAuthForm = ({
  authType,
  onAuthSuccess,
  onWaitingForOtp,
}: PhoneOtpAuthFormProps): JSX.Element => {
  const isRegister = authType === "register";
  const navigate = useNavigate();
  const location = useLocation();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submittedPhoneNumber, setSubmittedPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSendOtp = async () => {
    const normalizedPhoneNumber = validatePhoneNumber(phoneNumber);
    if (!normalizedPhoneNumber) {
      Notify({
        content: "Please enter a valid phone number with country code.",
        type: ToastTypes.Error,
      });
      return;
    }

    if (isRegister && !firstName.trim()) {
      Notify({
        content: "First name is required for registration.",
        type: ToastTypes.Error,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post<{ message: string }>(
        sendOtpEndpoint,
        { phoneNumber: normalizedPhoneNumber },
        { withCredentials: true },
      );

      setPhoneNumber(normalizedPhoneNumber);
      setSubmittedPhoneNumber(normalizedPhoneNumber);
      setIsOtpSent(true);
      setOtpCode("");
      onWaitingForOtp?.(true);

      Notify({
        content: response.data.message || "OTP sent successfully.",
        type: ToastTypes.Success,
      });
    } catch (error) {
      getAxiosError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpSent) return;

    if (!OTP_CODE_REGEX.test(otpCode.trim())) {
      Notify({
        content: "Please enter a valid OTP code.",
        type: ToastTypes.Error,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = isRegister
        ? {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }
        : {
            phoneNumber: submittedPhoneNumber,
            otpCode: otpCode.trim(),
          };

      const response = await axios.post<PhoneAuthSuccessResponse>(
        verifyOtpEndpoint,
        payload,
        { withCredentials: true },
      );

      handleSetAuthInfo({
        isAuthenticated: true,
        user: response.data.user,
      });

      Notify({
        content:
          response.data.message ||
          (isRegister
            ? "Phone verified and account created."
            : "Logged in successfully."),
        type: ToastTypes.Success,
      });

      const returnUrl = popReturnUrl();
      const currentUrl = location.pathname + location.search;

      onWaitingForOtp?.(false);
      onAuthSuccess?.();

      if (returnUrl && returnUrl === currentUrl) {
        // In-place auth (login modal on /create): the form is still mounted
        // with the user's data, so stay put and discard the saved draft.
        popCreateDraft();
      } else {
        navigate(returnUrl ?? routes.myProfile(response.data.user._id), {
          replace: true,
        });
      }
    } catch (error) {
      getAxiosError(error);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOtpSent) {
      void handleSendOtp();
    } else {
      void handleVerifyOtp();
    }
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit}
    >
      {isRegister && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isOtpSent}
            autoComplete="given-name"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isOtpSent}
            autoComplete="family-name"
          />
        </Box>
      )}

      <MuiTelInput
        value={phoneNumber}
        onChange={(value) => setPhoneNumber(value)}
        label="Phone Number"
        required
        disabled={isOtpSent}
        defaultCountry="US"
      />

      {isOtpSent && (
        <>
          <TextField
            required
            fullWidth
            label="OTP Code"
            placeholder="Enter the code sent by SMS"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            autoComplete="one-time-code"
          />
          <Typography variant="body2" color="text.secondary">
            OTP sent to {submittedPhoneNumber}
          </Typography>
        </>
      )}

      {!isOtpSent ? (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </Button>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1.5}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleChangePhoneNumber}
            disabled={isSubmitting}
          >
            Change Number
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Verifying..."
              : isRegister
                ? "Verify & Register"
                : "Verify & Login"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PhoneOtpAuthForm;
