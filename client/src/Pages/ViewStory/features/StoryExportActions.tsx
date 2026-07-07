import {
  AutoStoriesOutlined,
  BrushOutlined,
  DownloadOutlined,
  MailOutlined,
} from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { FC, useState } from "react";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { honey400, twilight300 } from "src/application/shared/themes";

import AvatarCard from "src/components/shared/AvatarCard/AvatarCard";
import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import axios from "axios";
import { useAvatar } from "src/Pages/Avatars/useAvatars";

interface StoryExportActionsProps {
  story: Story;
  canEmail: boolean;
}

const StoryExportActions: FC<StoryExportActionsProps> = ({
  story,
  canEmail,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const { avatar, isLoading: isAvatarLoading } = useAvatar(story.avatarId);

  const stillGenerating = story.imagesStatus === "pending";
  const hasAvatar = Boolean(story.avatarId);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await axios.get<{ url: string }>(
        END_POINTS.STORIES.EXPORT_STORY_PDF(story.slug),
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
        p: { xs: "16px", sm: "20px 22px" },
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{
        alignItems: "flex-start"
      }}>
        <Grid size={{ xs: 12, md: hasAvatar ? 8 : 12 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              mb: 2,
            }}
          >
            <AutoStoriesOutlined sx={{ color: honey400, fontSize: 22 }} />
            <Typography
              component="h3"
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: { xs: 18, sm: 20 },
                color: "text.primary",
              }}
            >
              Turn this into an eBook
            </Typography>
          </Box>

          <Typography
            sx={{
              mb: 2,
              fontSize: 14,
              lineHeight: 1.55,
              color: "text.secondary",
            }}
          >
            Download a beautifully designed PDF storybook — a lovely keepsake to
            read again and again.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: 1.25,
            }}
          >
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
              sx={{ width: { xs: "100%", sm: "auto" } }}
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
                sx={{ width: { xs: "100%", sm: "auto" } }}
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
                alignItems: "flex-start",
                gap: 0.75,
              }}
            >
              <BrushOutlined
                sx={{ color: twilight300, fontSize: 15, mt: "2px" }}
              />
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Illustrations are still being painted — your eBook will be ready
                once they finish.
              </Typography>
            </Box>
          )}
        </Grid>

        {hasAvatar && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: 240, md: 200 },
                mx: { xs: "auto", md: 0 },
                ml: { md: "auto" },
              }}
            >
              {isAvatarLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 120,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                avatar && <AvatarCard avatar={avatar} readOnly size="mini" />
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StoryExportActions;
