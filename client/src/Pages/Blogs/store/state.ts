export interface BlogsInitialState {
  isFetching: boolean;
  contactForm: BlogsFormState;
}

export interface BlogsFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getBlogsInitialState = (): BlogsInitialState => {
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
