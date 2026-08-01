export type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const emptyContactForm = (): ContactFormState => ({
  name: "",
  email: "",
  subject: "",
  message: "",
});
