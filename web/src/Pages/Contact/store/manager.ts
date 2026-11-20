import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import { ContactFormState } from "./state";
import { ContactStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";
import { trackEvent } from "src/shared/utils/ga4";
import { useTranslation } from "react-i18next";

export interface ContactManager {
  handleUpdateContactForm: (key: string, value: string) => void;
  handleSubmitContactForm: (state: ContactFormState) => Promise<void>;
}

export const useContactManager = (store: ContactStore): ContactManager => {
  const { t } = useTranslation("common");
  const { t: tPage } = useTranslation("page");
  const handleUpdateContactForm = (key: string, value: string): void => {
    store.updateContactForm(key, value);
  };

  const handleSubmitContactForm = async (formState: ContactFormState) => {
    store.handleIsFetching(true);

    try {
      await axios.post(
        END_POINTS.CONTACT.SUPPORT,
        {
          ...formState,
          ...store.state.security,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      Notify({
        content: t("emailSentSuccess"),
        type: ToastTypes.Success,
      });

      trackEvent("contact_submit");

      store.resetFormState();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 429 || status === 403) {
        Notify({
          content: tPage(status === 429 ? "contact.rateLimited" : "contact.verificationFailed"),
          type: ToastTypes.Error,
        });
      } else if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
      throw new Error(`❌  Failed to send email!  ${error}`);
    } finally {
      store.handleIsFetching(false);
      // Turnstile tokens are single-use: get a fresh one for the next send.
      store.updateSecurity({ turnstileToken: "" });
      store.turnstileRef.current?.reset();
    }
  };

  return {
    handleUpdateContactForm,
    handleSubmitContactForm,
  };
};
