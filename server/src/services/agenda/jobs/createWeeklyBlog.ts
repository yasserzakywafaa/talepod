import { Job } from "agenda";
import { SupportedLanguages } from "../../../utils/languages";
import { getCreateBlogPrompt } from "../../../services/create/getCreateBlogPrompt";
import { handleCreateBlog } from "../../../services/create/blog";

interface BlogData {
  topic: string;
  author: string;
  targetPublishDate?: Date;
}

const createWeeklyBlogJob = async (job?: Job<BlogData>) => {
  try {
    // const { topic, author, targetPublishDate } = job.attrs.data;

    const prompt = getCreateBlogPrompt(
      "Winnie-the-Pooh by A.A. Milne",
      SupportedLanguages.en
    );

    await handleCreateBlog(prompt, SupportedLanguages.en);

    console.log(`✅ Job "Create Weekly Blog" has been executed..`);
  } catch (error) {
    console.error("❌ Blog creation job failed:", error);
    throw new Error("", { cause: error });
  }
};

export default createWeeklyBlogJob;
