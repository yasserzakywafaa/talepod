import { DocumentsEnum } from "src/shared/enums";
import { DocumentsStoreSchema } from "src/shared/interfaces";

export const InitialDBStoreSchema: DocumentsStoreSchema = {
  config: {
    isFetching: false,
    isSyncActive: false,
  },
  covers: [
    {
      _id: DocumentsEnum.Covers,
      _rev: "",
    },
  ],
};

export default InitialDBStoreSchema;
