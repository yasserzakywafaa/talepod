import { DocumentsEnum } from "./enums";
import { InitialState } from "./interfaces";

const initialState: InitialState = {
  player: {
    _id: DocumentsEnum.Covers,
    data: {
      description: "Description",
      thumbnail: "Subtitle",
      title: "Title",
      name: "",
      order: -1,
      id: "",
    },
  },
  settings: {
    config: {
      isFetching: false,
      isSyncActive: false,
    },
    covers: [],
    files: [],
  },
};

export default initialState;
