import { ActiveGeneration } from "./state";
import APP_CONSTANTS from "src/application/shared/app_constants";
import { useState } from "react";

const STORAGE_KEY = APP_CONSTANTS.LOCAL_STORAGE.ACTIVE_GENERATION;

export interface GenerationStore {
  job: ActiveGeneration | null;
  setJob: (job: ActiveGeneration | null) => void;
}

const readPersistedJob = (): ActiveGeneration | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveGeneration;
    return parsed?.storyId ? parsed : null;
  } catch {
    return null;
  }
};

const persistJob = (job: ActiveGeneration | null) => {
  try {
    if (job) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(job));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage unavailable — keep in-memory state only */
  }
};

/**
 * App-global store for the active story generation. Rehydrates from
 * localStorage on init so a refresh mid-generation keeps the chip and lets the
 * manager resume polling; every change is mirrored back to storage.
 */
const useGenerationStore = (): GenerationStore => {
  const [job, setJobState] = useState<ActiveGeneration | null>(() =>
    readPersistedJob()
  );

  const setJob = (next: ActiveGeneration | null) => {
    persistJob(next);
    setJobState(next);
  };

  return { job, setJob };
};

export default useGenerationStore;
