export interface BlogInitialState {
  isFetching: boolean;
  contactForm: BlogFormState;
}

export interface BlogFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getBlogInitialState = (): BlogInitialState => {
  return {
    isFetching: false,
    contactForm: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  };
};
