import type { Story } from "src/features/storyCreator/store/state";

/** Cover for list cards — matches web `StoryCard` `getCover`. */
export const getStoryCoverImageUrl = (story: Story): string | undefined =>
  story.coverImageUrl ||
  story.pages?.find((page) => page.imageUrl)?.imageUrl ||
  story.longStoryImages?.find((image) => image.imageUrl)?.imageUrl ||
  undefined;
