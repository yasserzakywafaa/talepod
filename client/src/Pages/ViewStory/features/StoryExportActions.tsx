import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  AutoStoriesOutlined,
  BrushOutlined,
  DownloadOutlined,
  MailOutlined,
} from "@mui/icons-material";
import { FC, useState } from "react";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import axios from "axios";
import { honey400, twilight300 } from "src/application/shared/themes";

interface StoryExportActionsProps {
  story: Story;
  /** Whether the signed-in user can be emailed the eBook. */
  canEmail: boolean;
}

/**
 * "Take it with you" panel under the reader: export the story as a beautifully
 * formatted eBook PDF and (when signed in) have it emailed. The PDF is
 * generated once on the server and reused for both actions.
 */
const StoryExportActions: FC<StoryExportActionsProps> = ({
  story,
  canEmail,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);

  const stillGenerating = story.imagesStatus === "pending";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await axios.get<{ url: string }>(
        END_POINTS.STORIES.EXPORT_STORY_PDF(story.slug)
      );
      window.open(data.url, "_blank", "noopener");
      Notify({ type: ToastTypes.Success, content: "Your eBook is ready." });
    } catch (error) {
      Notify({
        type: ToastTypes.Error,
        content: "❌ Couldn't build the PDF. Please try again.",
      });
      console.error("❌ Failed to export story PDF", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    setEmailing(true);
    try {
      await axios.post(END_POINTS.STORIES.EMAIL_STORY_PDF(story.slug));
      Notify({
        type: ToastTypes.Success,
        content: "We'll email your eBook shortly. 📩",
      });
    } catch (error) {
      Notify({
        type: ToastTypes.Error,
        content: "❌ Couldn't email your eBook. Please try again.",
      });
      console.error("❌ Failed to email story PDF", error);
    } finally {
      setEmailing(false);
    }
  };

  return (
    <Box
      sx={{
        mt: "22px",
        mb: "22px",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "var(--r-xl)",
        p: "20px 22px",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}>
        <AutoStoriesOutlined sx={{ color: honey400, fontSize: 22 }} />
        <Typography
          component="h3"
          sx={{ fontFamily: "var(--font-display)", fontSize: 20, color: "text.primary" }}
        >
          Turn this into an eBook
        </Typography>
      </Box>

      <Typography
        sx={{ mb: 2, fontSize: 14, lineHeight: 1.55, color: "text.secondary" }}
      >
        Download a beautifully designed PDF storybook — a lovely keepsake to read
        again and again.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
        <Button
          variant="contained"
          disabled={downloading || stillGenerating}
          onClick={handleDownload}
          startIcon={
            downloading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DownloadOutlined />
            )
          }
        >
          {downloading ? "Preparing…" : "Download eBook"}
        </Button>

        {canEmail && (
          <Button
            variant="outlined"
            disabled={emailing || stillGenerating}
            onClick={handleEmail}
            startIcon={
              emailing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MailOutlined />
              )
            }
          >
            {emailing ? "Sending…" : "Email me the eBook"}
          </Button>
        )}
      </Box>

      {stillGenerating && (
        <Box
          sx={{
            mt: 1.75,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          <BrushOutlined sx={{ color: twilight300, fontSize: 15 }} />
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Illustrations are still being painted — your eBook will be ready once
            they finish.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StoryExportActions;
