import { InitialState } from "./interfaces";

const initialState: InitialState = {
  settings: {
    config: {
      isFetching: false,
      isSyncActive: false,
    },
    covers: [],
  },
};

export default initialState;
