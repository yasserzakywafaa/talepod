import { ComicPage, StoryParts } from "src/models/types";

const clean = (s: string): string => s.replace(/[{}]/g, "").trim();

// Function to extract the parts of the (long) story
const extractStoryParts = (story: string): StoryParts => {
  const parts = story.match(/{([^}]*)}/g);

  // Lenient: accept >= 4 sections and use the first four (title, summary,
  // mainStory, poem). A stray extra {} in the prose must not 500 the request.
  if (parts && parts.length >= 4) {
    return {
      title: clean(parts[0]),
      summary: clean(parts[1]),
      mainStory: clean(parts[2]),
      poem: clean(parts[3]),
    };
  } else {
    throw new Error("❌ The story does not contain the correct structure!");
  }
};

export interface ComicParts {
  title: string;
  summary: string;
  pages: ComicPage[];
}

/**
 * Parses the comic structure: {title}{summary} then, per page, {caption}{scene}.
 * Lenient about the exact page count (accepts ~4-8 pages); the scene text
 * becomes each page's `imagePrompt` for later illustration generation.
 */
export const extractComicParts = (story: string): ComicParts => {
  const parts = story.match(/{([^}]*)}/g);

  if (!parts || parts.length < 4) {
    throw new Error("❌ The comic does not contain the correct structure!");
  }

  const title = clean(parts[0]);
  const summary = clean(parts[1]);
  const pageParts = parts.slice(2);
  const pages: ComicPage[] = [];

  for (let i = 0; i + 1 < pageParts.length; i += 2) {
    pages.push({
      index: pages.length,
      caption: clean(pageParts[i]),
      imagePrompt: clean(pageParts[i + 1]),
    });
  }

  if (pages.length < 2) {
    throw new Error("❌ The comic does not contain enough pages!");
  }

  return { title, summary, pages };
};

export default extractStoryParts;
