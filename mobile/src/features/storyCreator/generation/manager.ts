import { GenerationTextStatus } from "./state";
import type { AxiosResponse } from "axios";
import { useCallback, useEffect, useRef } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { GenerationStore } from "./store";
import type { Story } from "../store/state";
import { useApplicationContext } from "src/application/store/Provider";
import { dedupedGet } from "src/shared/api/dedupedGet";

export interface GenerationManager {
  isGenerating: boolean;
  startGeneration: (placeholder: Story, childName: string) => void;
  dismissGeneration: () => void;
}

interface StatusResponse {
  textStatus?: GenerationTextStatus;
  imagesStatus?: "pending" | "ready" | "failed";
  slug?: string;
  title?: string;
}

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 30;
const activeStatusPolls = new Set<string>();

export const useGenerationManager = (
  store: GenerationStore,
): GenerationManager => {
  const {
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const storeRef = useRef(store);
  storeRef.current = store;

  const isGenerating = store.job?.textStatus === "pending";

  const pollForStatus = useCallback(
    (storyId: string) => {
      if (activeStatusPolls.has(storyId)) return;
      activeStatusPolls.add(storyId);

      let attempts = 0;
      const tick = async () => {
        attempts += 1;
        let status: StatusResponse | undefined;
        try {
          const response: AxiosResponse<StatusResponse> = await dedupedGet(
            END_POINTS.CREATE.GENERATE.STORY_STATUS(storyId),
          );
          status = response.data;
        } catch (error) {
          console.error("Failed to poll story status", { storyId, error });
        }

        const textStatus = status?.textStatus;
        const currentStore = storeRef.current;

        if (textStatus === "ready") {
          activeStatusPolls.delete(storyId);
          const slug = status?.slug ?? "";
          currentStore.setJob({
            storyId,
            slug,
            title: status?.title ?? "Your story",
            childName: currentStore.job?.childName ?? "",
            format: currentStore.job?.format ?? "comic",
            textStatus: "ready",
          });
          const refreshedUser = await handleFetchUserInfo();
          if (refreshedUser) {
            handleSetAuthInfo({ isAuthenticated: true, user: refreshedUser });
          }
          return;
        }

        if (textStatus === "failed") {
          activeStatusPolls.delete(storyId);
          currentStore.setJob({
            storyId,
            slug: currentStore.job?.slug ?? "",
            title: currentStore.job?.title ?? "",
            childName: currentStore.job?.childName ?? "",
            format: currentStore.job?.format ?? "comic",
            textStatus: "failed",
          });
          return;
        }

        if (attempts < POLL_MAX_ATTEMPTS) {
          setTimeout(tick, POLL_INTERVAL_MS);
        } else {
          activeStatusPolls.delete(storyId);
        }
      };

      setTimeout(tick, POLL_INTERVAL_MS);
    },
    [handleFetchUserInfo, handleSetAuthInfo],
  );

  const startGeneration = (placeholder: Story, childName: string) => {
    store.setJob({
      storyId: placeholder._id,
      slug: placeholder.slug,
      title: placeholder.title,
      childName,
      format: placeholder.format ?? "comic",
      textStatus: "pending",
    });
    pollForStatus(placeholder._id);
  };

  const dismissGeneration = () => {
    if (store.job?.textStatus === "pending") return;
    store.setJob(null);
  };

  useEffect(() => {
    if (!store.hydrated) return;
    if (store.job?.textStatus === "pending") {
      pollForStatus(store.job.storyId);
    }
  }, [store.hydrated, store.job?.storyId, store.job?.textStatus, pollForStatus]);

  return {
    isGenerating,
    startGeneration,
    dismissGeneration,
  };
};
