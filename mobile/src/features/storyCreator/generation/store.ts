import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActiveGeneration } from "./state";
import APP_CONSTANTS from "src/application/shared/app_constants";

const STORAGE_KEY = APP_CONSTANTS.LOCAL_STORAGE.ACTIVE_GENERATION;

export interface GenerationStore {
  job: ActiveGeneration | null;
  setJob: (job: ActiveGeneration | null) => void;
  hydrated: boolean;
}

const useGenerationStore = (): GenerationStore => {
  const [job, setJobState] = useState<ActiveGeneration | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as ActiveGeneration;
          if (parsed?.storyId) {
            setJobState(parsed);
          }
        }
      } catch {
        /* ignore */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setJob = (next: ActiveGeneration | null) => {
    setJobState(next);
    void (async () => {
      try {
        if (next) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        /* ignore */
      }
    })();
  };

  return { job, setJob, hydrated };
};

export default useGenerationStore;
