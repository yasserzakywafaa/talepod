import Agenda from "agenda";
import createWeeklyBlogJob from "./jobs/createWeeklyBlog";
import { getMongoDbUri } from "../../models/mongoDb";
import testScheduleJob from "./jobs/testSchedule";
// import cron from "node-cron";

// CRON EXPRESSIONS VISUALIZATION
// * * * * * *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ │
// │ │ │ │ │ └─ Day of Week (0 - 7) (Sunday=0 or 7)
// │ │ │ │ └─ Month (1 - 12)
// │ │ │ └─ Day of Month (1 - 31)
// │ │ └─ Hour (0 - 23)
// │ └─ Minute (0 - 59)
// └─ Second (0 - 59) (Optional)

export enum AgendaJobsEnum {
  Test = "test",
  CreateWeeklyBlog = "create-weekly-blog",
}

let agenda: Agenda | undefined;

const agendaInit = async (): Promise<void> => {
  if (!agenda) {
    try {
      agenda = new Agenda({
        db: { address: getMongoDbUri(), collection: "agenda_jobs" },
        processEvery: "10 seconds",
      });

      agenda.define(AgendaJobsEnum.Test, testScheduleJob);

      agenda.define(AgendaJobsEnum.CreateWeeklyBlog, createWeeklyBlogJob);

      await agenda.start();
      console.log("✅  Agenda has been initialized!");
    } catch (error) {
      console.error("❌  Error initializing Agenda:", error);
    }
  } else {
    console.log("✅  Agenda has already been initialized!", { agenda });
  }
};

const testScheduleHandler = async (data?: any): Promise<void> => {
  await agenda.every("2 minutes", AgendaJobsEnum.Test, data, {});
};

const scheduleWeeklyBlog = async (blogData?: any): Promise<void> => {
  // Schedule every Monday at 9:00 AM
  await agenda.every("0 9 * * 1", AgendaJobsEnum.CreateWeeklyBlog, blogData, {
    // timezone: "America/New_York",
  });
};

const cancelJob = async (jobId: string): Promise<void> => {
  try {
    if (!agenda) {
      throw new Error(
        "Agenda is not initialized. Call initializeAgenda() first."
      );
    }
    await agenda.cancel({ _id: jobId as any });
    console.log(`Job with ID ${jobId} canceled.`);
  } catch (error) {
    console.error("Error canceling job:", error);
  }
};

const stopAgenda = async (): Promise<void> => {
  if (agenda) {
    try {
      await agenda.stop();
      console.log("Agenda stopped manually.");
    } catch (error) {
      console.error("Error stopping Agenda:", error);
    }
  }
};

export {
  agenda,
  agendaInit,
  cancelJob,
  stopAgenda,
  testScheduleHandler,
  scheduleWeeklyBlog,
};
