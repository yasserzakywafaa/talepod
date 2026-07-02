import { Story } from "src/components/StoryCreator/store/state";

const MAX_DESCRIPTION_LENGTH = 155;

function stripStoryText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateOnWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim();
}

export function buildStoryMetaDescription(story: Story): string {
  const childName = story.profileInfo?.name?.trim();
  const theme = story.storyParams?.environment?.name?.trim();
  const excerptSource =
    stripStoryText(story.mainStory || "") ||
    stripStoryText(story.summary || "") ||
    story.title?.trim() ||
    "";

  const excerpt = truncateOnWordBoundary(excerptSource, MAX_DESCRIPTION_LENGTH);

  const parts: string[] = [];
  if (childName) parts.push(`A personalized bedtime story for ${childName}`);
  if (theme) parts.push(`set in ${theme}`);
  if (excerpt) parts.push(excerpt);

  if (parts.length === 0) {
    return "Read a personalized bedtime story on TalePod.";
  }

  if (parts.length === 1) {
    return truncateOnWordBoundary(parts[0], MAX_DESCRIPTION_LENGTH);
  }

  const intro = parts.slice(0, 2).join(" ");
  const body = parts[2] ?? "";
  const combined = body ? `${intro}. ${body}` : intro;
  return truncateOnWordBoundary(combined, MAX_DESCRIPTION_LENGTH);
}
