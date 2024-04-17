import { AxiosResponse } from "axios";
import { AttachmentType } from "./enums";
export interface IParams {
  type: string;
  id: string;
}

export interface DocumentsStoreSchema {
  config: Config;
  covers: CoverDoc[];
  files: FileDoc[];
}

export interface Config {
  isFetching: boolean;
  isSyncActive: boolean;
}

export interface Document {
  _id: string;
  _rev?: string;
  data: FileData;
  _attachments?: Attachments;
}

export interface CoverDoc extends Document {}
export interface FileDoc extends Document {}
export interface MyListDoc extends Document {}

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

interface Users {
  _id: string;
  _rev?: string;
  data: User;
}

interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  username: string;
}

interface AllowedFiles {
  _id: string;
  _rev?: string;
  data: AllowedFile;
}
interface AllowedFile {
  fileId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  expired?: boolean;
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

enum UserRole {
  user = "user",
  admin = "admin",
}

export interface InitialState {
  player: FileDoc;
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
