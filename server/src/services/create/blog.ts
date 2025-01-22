import { Languages } from "../../utils/languages";
import { blogTopics } from "../../shared/mockedData/BlogTopics";

export const handleCreateBlog = async () => {
  console.log("🛠️  handleCreateBlog()  🛠️");
};

export const handleCreateBlogBulk = async () => {
  for (const blogTopic of blogTopics) {
    for (const language of Languages) {
      if (blogTopic.language === language.value) {
        console.log("⌛︎  Current Language:>>>", language.value);
        for (const topic of blogTopic.topics) {
          console.log("⌛︎  Current Topic:>>>", topic);

          await handleCreateBlog();
        }
      }
    }
  }
};
