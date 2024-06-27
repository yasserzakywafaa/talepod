import { Story } from "src/application/shared/interfaces";

// Function to extract the parts of the story
const extractStoryParts = (story: string): Partial<Story> => {
  const parts = story.match(/{([^}]*)}/g);

  if (parts && parts.length === 4) {
    return {
      title: parts[0].replace(/{|}/g, ""),
      summary: parts[1].replace(/{|}/g, ""),
      mainStory: parts[2].replace(/{|}/g, ""),
      poem: parts[3].replace(/{|}/g, ""),
    };
  } else {
    throw new Error(
      "❌ The story does not contain the correct number of parts"
    );
  }
};

export default extractStoryParts;
