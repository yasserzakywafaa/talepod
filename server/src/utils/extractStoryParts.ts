import { StoryParts } from "src/models/types";

// Function to extract the parts of the story
const extractStoryParts = (story: string): StoryParts => {
  const parts = story.match(/{([^}]*)}/g);

  if (parts && parts.length === 4) {
    return {
      title: parts[0].replace(/[{}]/g, "").trim(),
      summary: parts[1].replace(/[{}]/g, "").trim(),
      mainStory: parts[2].replace(/[{}]/g, "").trim(),
      poem: parts[3].replace(/[{}]/g, "").trim(),
    };
  } else {
    throw new Error(
      "❌ The story does not contain the correct number of parts"
    );
  }
};

export default extractStoryParts;
