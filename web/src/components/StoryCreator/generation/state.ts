import { StoryFormat } from "../store/state";

export type GenerationTextStatus = "pending" | "ready" | "failed";

/**
 * The single in-flight (or just-finished) story generation the app tracks. It
 * is persisted to localStorage so the docked progress chip survives a refresh
 * and resumes polling. `slug`/`navUrl` are only final once `textStatus` is
 * "ready" (the slug changes when the AI title lands).
 */
export interface ActiveGeneration {
  storyId: string;
  slug: string;
  title: string;
  childName: string;
  format: StoryFormat;
  textStatus: GenerationTextStatus;
  navUrl?: string;
}

export interface GenerationInitialState {
  job: ActiveGeneration | null;
}

export const getGenerationInitialState = (): GenerationInitialState => ({
  job: null,
});
