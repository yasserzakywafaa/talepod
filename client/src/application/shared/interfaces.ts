export interface Story {
  _id: string;
  id: string;
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
