import { useCallback, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import type { Story } from "src/features/storyCreator/store/state";
import logger from "src/shared/logger";

export interface ViewStoryState {
  story: Story | undefined;
  isFetching: boolean;
}

export const useViewStoryStore = () => {
  const [state, setState] = useState<ViewStoryState>({
    story: undefined,
    isFetching: false,
  });

  const setIsFetching = useCallback((isFetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching }));
  }, []);

  const updateStory = useCallback((story: Story | undefined) => {
    setState((prev) => ({ ...prev, story }));
  }, []);

  return { state, setIsFetching, updateStory };
};

export type ViewStoryStore = ReturnType<typeof useViewStoryStore>;

const IMAGE_POLL_INTERVAL_MS = 5000;
const IMAGE_POLL_MAX_ATTEMPTS = 24;
const activeImagePolls = new Set<string>();

export const useViewStoryManager = (store: ViewStoryStore) => {
  const fetchStoryBySlug = useCallback(
    async (
      slug: string,
      options?: { keepOnError?: boolean },
    ): Promise<Story | undefined> => {
      try {
        const { data } = await api.get<Story>(
          END_POINTS.STORIES.GET_STORY_BY_SLUG(slug),
        );
        store.updateStory(data);
        return data;
      } catch (error) {
        if (!options?.keepOnError) {
          store.updateStory(undefined);
        }
        logger.error("Failed to get story by slug", error);
        return undefined;
      } finally {
        store.setIsFetching(false);
      }
    },
    [store],
  );

  const pollForImages = useCallback(
    (slug: string) => {
      if (activeImagePolls.has(slug)) return;
      activeImagePolls.add(slug);

      let attempts = 0;
      const tick = async () => {
        attempts += 1;
        const story = await fetchStoryBySlug(slug, { keepOnError: true });
        if (story?.imagesStatus !== "pending") {
          activeImagePolls.delete(slug);
          return;
        }
        if (attempts < IMAGE_POLL_MAX_ATTEMPTS) {
          setTimeout(tick, IMAGE_POLL_INTERVAL_MS);
        } else {
          activeImagePolls.delete(slug);
        }
      };
      setTimeout(tick, IMAGE_POLL_INTERVAL_MS);
    },
    [fetchStoryBySlug],
  );

  const setUp = useCallback(
    async (slug: string) => {
      store.setIsFetching(true);
      const story = await fetchStoryBySlug(slug);
      if (story?.imagesStatus === "pending") {
        pollForImages(slug);
      }
    },
    [fetchStoryBySlug, pollForImages, store],
  );

  return { setUp, fetchStoryBySlug };
};
