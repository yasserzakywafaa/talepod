import { Job } from "agenda";
import { SupportedLanguages } from "../../../utils/languages";
import { agenda } from "../agenda";
import { blogTopics } from "../../../shared/mockedData/BlogTopics";
import { handleCreateBulkBlogs } from "../../../services/create/blog";

const testScheduleJob = async (job?: Job) => {
  try {
    if (!agenda) {
      throw new Error("❌ Agenda must be initialized before scheduling jobs.");
    }

    console.log('⌛︎  Running an Agenda job "testScheduleJob"');

    await handleCreateBulkBlogs([
      {
        data: [blogTopics[0].data[0]],
        language: SupportedLanguages.en,
      },
    ]);
  } catch (error) {
    throw new Error("❌ Error starting Agenda!", { cause: error });
  }
};

export default testScheduleJob;
