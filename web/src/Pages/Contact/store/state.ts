export interface ContactInitialState {
  isFetching: boolean;
  contactForm: ContactFormState;
  /** Anti-spam fields sent with the form (client-core Turnstile + Honeypot). */
  security: ContactSecurityState;
}

export interface ContactSecurityState {
  turnstileToken: string;
  /** Honeypot: stays empty for people. */
  website: string;
  /** When the form was first shown (server time trap). */
  startedAt: number;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getContactInitialState = (): ContactInitialState => {
  return {
    isFetching: false,
    contactForm: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    security: { turnstileToken: "", website: "", startedAt: 0 },
  };
};
