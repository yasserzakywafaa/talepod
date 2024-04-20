import { AttachmentType } from "./enums";
import { AxiosResponse } from "axios";
export interface Params {
  type: string;
  id: string;
}

export interface DocumentsStoreSchema {
  config: Config;
  covers: CoverDoc[];
}

export interface Config {
  isFetching: boolean;
  isSyncActive: boolean;
}

export interface Document {
  _id: string;
  _rev: string;
  data?: FileData;
  _attachments?: Attachments;
}

export interface CoverDoc extends Document {}

export interface ListsTitles {
  myListFiles: string;
}

export interface Attachments {
  [key: string]: Attachment;
}
export interface Attachment {
  data: any;
  name: string;
  thumbnail?: string;
  content_type: string;
  type: AttachmentType;
}

export interface FileData {
  id: string;
  title: string;
  type?: string;
  order: number;
  name: string;
  thumbnail?: string;
  description: string;
}

export interface InitialState {
  settings: DocumentsStoreSchema;
}

export interface CallbackProps {
  error: any;
  hasError: boolean;
  response: AxiosResponse;
}

export interface ReorderCardsParams {
  section: string;
  srcIndex: number;
  destIndex: number;
  docs?: Document[];
  draggableId: string;
  reorderLogic?: number;
}

export interface ConvertedFileTypes {
  base64: string;
  dataURL: string;
}
