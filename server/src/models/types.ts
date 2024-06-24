import { ObjectId } from "mongodb";

export interface Story {
  _id: ObjectId;
  title: string;
  summary: string;
  mainStory: string;
  poem: string;
  audioFile?: StoryAudioFile;
  createdAt: Date;
}

export interface StoryAudioFile {
  url: string;
  fileName: string;
  createdAt: Date;
}

export interface StoryParts {
  title: string;
  summary: string;
  mainStory: string;
  poem: string;
}
