import "./ViewStory.scss";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import Box from "@mui/material/Box";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import { LyricsOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import ReactMarkdown from "react-markdown";
import Share from "../../components/shared/Share";
import StoryNotFound from "./features/StoryNotFound";
import ViewStoryInfo from "./features/ViewStoryInfo";
import ViewStorySEO from "./features/ViewStorySEO";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useEffect } from "react";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import { useParams } from "react-router-dom";
import { useViewStoryContext } from "./store/Provider";

const ViewStoryPage: React.FC = () => {
  const { userId, slug } = useParams<{ userId: string; slug: string }>();
  const { isDesktop } = useDeviceSize();

  const {
    store: {
      state: { isFetching, isCreatingAudio, story },
      // handleIsFetching,
      handleUpdateStory,
      handleIsCreatingAudio,
    },
    manager: { setUp },
  } = useViewStoryContext();
  const {
    manager: { handleCreateAudio },
  } = useOpenaiContext();

  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const hasDirectionRtl = story && story.profileInfo.language.value === "ar";

  const isReadOnlyMode = () => {
    if (auth.user && auth.user._id !== userId) {
      return true;
    } else return false;
  };

  const handleOnCreateAudioClick = async () => {
    handleIsCreatingAudio(true);
    if (story.mainStory) {
      try {
        const audioFile = await handleCreateAudio(story);
        if (audioFile && audioFile.url) {
          handleUpdateStory({
            ...story,
            audioFile,
          });
        }
      } catch (error) {
        Notify({
          type: ToastTypes.Error,
          content: `❌ Failed to create audio! ${error}`,
        });
      }
    }
    handleIsCreatingAudio(false);
  };

  useEffect(() => {
    if (slug) setUp(slug);
  }, [slug]);

  useEffect(() => {
    if (story && story._id) {
      const metaTag = document
        .getElementsByTagName("meta")
        .namedItem("description");

      metaTag?.setAttribute(
        "content",
        `Discover more bedtime stories for children and families on TalePod | ${story.summary}`
      );

      const newStoryCreated =
        window.localStorage.getItem("newStoryCreated") === "true";
      if (newStoryCreated) {
        Notify({
          type: ToastTypes.Success,
          content: "Story created successfully.",
        });
        window.localStorage.removeItem("newStoryCreated");
      }
    }
  }, [story]);

  return (
    <Page
      isLoading={isFetching || isCreatingAudio}
      // isLoading={!isCreatingAudio}
      className="view-story-page"
      title={`Bedtime story on TalePod | ${story && story.title}`}
      loaderComponentName={
        isCreatingAudio
          ? LoaderComponentNameEnum.CreateAudio
          : LoaderComponentNameEnum.BedtimeStory
      }
    >
      <Container
        className="view-story-container"
        sx={{
          pt: { xs: 1 },
          pb: 4,
        }}
      >
        {!isFetching && !story && <StoryNotFound />}

        {story && (
          <>
            <Card
              className="view-story-card"
              vocab="https://schema.org"
              typeof="ShortStory"
            >
              <Box component="div" className="bg-image-character">
                <RandomImage />
              </Box>
              <CardContent className="view-story-card-content">
                {/* {isReadOnlyMode() && (
                  <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                    {"Shared by: Yasser"}
                  </Alert>
                )} */}

                <Typography
                  gutterBottom
                  variant="h4"
                  component="h1"
                  color="primary"
                  property="name"
                  className={`view-story-card-title ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{ fontSize: { xs: "2rem", sm: "2.25rem" } }}
                >
                  {story.title}
                </Typography>

                <Typography
                  variant="h5"
                  component="h2"
                  className={`view-story-card-summary ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                >
                  {story.summary}
                </Typography>

                <Card
                  className="view-story-card-story-wrapper"
                  sx={{
                    textAlign: "center",
                    mt: 1,
                    mb: 2,
                    py: !isReadOnlyMode() ? 1 : 0,
                    px: 1,
                  }}
                >
                  {!isReadOnlyMode() && !story.audioFile && (
                    <>
                      <Typography
                        gutterBottom
                        component="h3"
                        sx={{
                          fontSize: "1.25rem",
                          color: (theme) => theme.palette.primary.main,
                        }}
                      >
                        Create audio for this story
                      </Typography>

                      <Button
                        size="large"
                        type="button"
                        variant="contained"
                        endIcon={<LyricsOutlined />}
                        onClick={handleOnCreateAudioClick}
                      >
                        Create Audio
                      </Button>
                    </>
                  )}

                  {story.audioFile && (
                    <Box mt={2}>
                      <Typography
                        variant="h6"
                        component="h6"
                        gutterBottom
                        sx={{ color: (theme) => theme.palette.primary.main }}
                      >
                        Listen to the Story
                      </Typography>

                      <CardMedia
                        component="audio"
                        controls
                        src={story.audioFile.url}
                      />

                      <Chip
                        sx={{ mt: 2, mb: 1 }}
                        variant="outlined"
                        label={
                          <span color="textSecondary">
                            Audio created on:{" "}
                            <span className="bold">
                              {new Date(
                                story.audioFile.createdAt
                              ).toLocaleString("en-GB", {
                                timeStyle: "short",
                                dateStyle: "short",
                              })}
                            </span>
                          </span>
                        }
                        color="primary"
                      />
                    </Box>
                  )}
                </Card>
                {isDesktop ? (
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    Story
                  </Typography>
                ) : (
                  <></>
                )}

                <Box
                  component="article"
                  className={`view-story-card-main-story ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                >
                  <ReactMarkdown>{story.mainStory}</ReactMarkdown>
                </Box>

                <pre
                  className={`italics view-story-card-poem ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                >
                  {story.poem}
                </pre>

                <ViewStoryInfo story={story} />

                <Share story={story} />
              </CardContent>
            </Card>

            <ViewStorySEO story={story} />
          </>
        )}
      </Container>
    </Page>
  );
};

export default ViewStoryPage;
