import END_POINTS from "../../models/endpoints";
import { User } from "src/models/types";
import axios from "axios";

export interface WebhookN8n {
  eventName: string;
  data: {
    storyId: string;
    storyTitle: string;
    storyUrl: string;
    user: User;
    isDev: boolean;
    isProd: boolean;
  };
}

export const handleTriggerWebhookN8n = async (
  webhookData: WebhookN8n
): Promise<void> => {
  try {
    await axios.post(END_POINTS.WEBHOOKS.N8N.NEW_STORY_ADDED, webhookData, {
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": new Date().toISOString(),
      },
    });

    console.log(
      `✅  Webhook "${webhookData.eventName}" triggered successfully!`
    );
  } catch (error) {
    console.error(
      `❌  Failed to trigger n8n webhook "${webhookData.eventName}"!`,
      {
        error,
      }
    );
  }
};
