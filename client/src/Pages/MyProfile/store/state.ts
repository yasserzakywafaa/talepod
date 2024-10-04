export interface MyProfileInitialState {
  isFetching: boolean;
  MyProfileForm: MyProfileFormState;
}

export interface MyProfileFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getMyProfileInitialState = (): MyProfileInitialState => {
  return {
    isFetching: false,
    MyProfileForm: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  };
};
