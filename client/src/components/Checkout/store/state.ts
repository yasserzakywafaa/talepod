export interface CheckoutInitialState {
  isFetching: boolean;
  publishableKey: string;
  clientSecret: string;
}

export const getCheckoutInitialState = (): CheckoutInitialState => {
  return {
    isFetching: false,
    publishableKey: "",
    clientSecret: "",
  };
};
