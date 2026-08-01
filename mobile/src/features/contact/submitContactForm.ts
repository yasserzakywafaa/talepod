import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import type { ContactFormState } from "src/features/contact/types";

export const submitContactForm = async (form: ContactFormState): Promise<void> => {
  await api.post(END_POINTS.CONTACT.SUPPORT, form, {
    headers: {
      "Content-Type": "application/json",
      "X-Custom-Header": new Date().toISOString(),
    },
  });
};
