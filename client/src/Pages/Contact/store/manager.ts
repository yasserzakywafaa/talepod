import { ContactFormState } from "./state";
import { ContactStore } from "./store";

export interface ContactManager {
  setUp: () => Promise<void>;
  handleUpdateContactForm: (key: string, value: string) => void;
  handleSubmitContactForm: (state: ContactFormState) => void;
}

export const useContactManager = (store: ContactStore): ContactManager => {
  const setUp = async () => {
    // store.handleIsFetching(true);
    // store.handleIsFetching(false);
  };

  const handleUpdateContactForm = (key: string, value: string): void => {
    console.log("handleUpdateContactForm", {
      key,
      value,
    });

    store.updateContactForm(key, value);
  };

  const handleSubmitContactForm = async (formState: ContactFormState) => {
    console.log("ℹ️ Contact Form Submit:", { formState });
  };

  return {
    setUp,
    handleUpdateContactForm,
    handleSubmitContactForm,
  };
};
