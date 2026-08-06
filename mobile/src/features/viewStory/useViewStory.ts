import { useQuery } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import type { Story } from "src/features/storyCreator/store/state";
import { queryKeys } from "src/shared/api/queryKeys";

const fetchStoryBySlug = async (slug: string): Promise<Story> => {
  const { data } = await api.get<Story>(
    END_POINTS.STORIES.GET_STORY_BY_SLUG(slug),
  );
  return data;
};

/** Illustrations still rendering server-side: stops once they land or after 2 minutes. */
const IMAGE_POLL_INTERVAL_MS = 5000;
const IMAGE_POLL_MAX_ATTEMPTS = 24;

/**
 * A single story, polled while its illustrations generate. `refetchInterval`
 * replaces a hand-rolled loop that never stopped on unmount.
 */
export const useViewStory = (slug: string) => {
  const query = useQuery({
    queryKey: queryKeys.stories.bySlug(slug),
    queryFn: () => fetchStoryBySlug(slug),
    refetchInterval: (q) => {
      const story = q.state.data;
      if (!story || story.imagesStatus !== "pending") return false;

      const attempts = q.state.dataUpdateCount;
      if (attempts >= IMAGE_POLL_MAX_ATTEMPTS) return false;

      return IMAGE_POLL_INTERVAL_MS;
    },
  });

  return {
    story: query.data,
    // Only the very first load blocks the screen; a background poll refresh
    // must not flash the loading state over a story already on screen.
    isFetching: query.isPending,
  };
};
