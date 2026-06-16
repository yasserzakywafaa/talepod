import { GenerationTextStatus } from "./state";
import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { GenerationStore } from "./store";
import { Story } from "../store/state";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";

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

// Mirror of the ViewStory image poll: re-check status on an interval until the
// text lands, then stop. Module-level dedup guards against double polling the
// same story (e.g. start + refresh-resume firing together).
const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 30; // ~2 minutes
const activeStatusPolls = new Set<string>();

export const useGenerationManager = (
  store: GenerationStore
): GenerationManager => {
  const {
    store: {
      state: {
        auth: { user },
      },
    },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const isGenerating = store.job?.textStatus === "pending";

  // Re-fetch the lightweight status until text generation finishes, then stop.
  const pollForStatus = useCallback(
    (storyId: string) => {
      if (activeStatusPolls.has(storyId)) return;
      activeStatusPolls.add(storyId);

      let attempts = 0;
      const tick = async () => {
        attempts += 1;
        let status: StatusResponse | undefined;
        try {
          const response: AxiosResponse<StatusResponse> = await axios.get(
            END_POINTS.CREATE.GENERATE.STORY_STATUS(storyId)
          );
          status = response.data;
        } catch (error) {
          console.error("❌ Failed to poll story status", { storyId, error });
        }

        const textStatus = status?.textStatus;

        if (textStatus === "ready") {
          activeStatusPolls.delete(storyId);
          const slug = status?.slug ?? "";
          const navUrl = user?._id
            ? routes.myStory(user._id, slug)
            : routes.story(slug);
          store.setJob({
            storyId,
            slug,
            title: status?.title ?? "Your story",
            childName: store.job?.childName ?? "",
            format: store.job?.format ?? "comic",
            textStatus: "ready",
            navUrl,
          });
          window.localStorage.setItem(
            APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
            "true"
          );
          // Reflect the new storyCount / credits consumed by this story.
          const refreshedUser = await handleFetchUserInfo();
          if (refreshedUser) {
            handleSetAuthInfo({ isAuthenticated: true, user: refreshedUser });
          }
          return;
        }

        if (textStatus === "failed") {
          activeStatusPolls.delete(storyId);
          store.setJob({
            storyId,
            slug: store.job?.slug ?? "",
            title: store.job?.title ?? "",
            childName: store.job?.childName ?? "",
            format: store.job?.format ?? "comic",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, store.job]
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
    // Never drop a job that's still generating (chip stays until done).
    if (store.job?.textStatus === "pending") return;
    store.setJob(null);
  };

  // Refresh-safety: a rehydrated, still-pending job resumes polling on mount.
  useEffect(() => {
    if (store.job?.textStatus === "pending") {
      pollForStatus(store.job.storyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isGenerating,
    startGeneration,
    dismissGeneration,
  };
};
