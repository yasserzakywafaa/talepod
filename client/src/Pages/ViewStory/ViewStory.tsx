import "./ViewStory.scss";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import { AutoAwesome } from "@mui/icons-material";
import Box from "@mui/material/Box";
import DreamingFox from "../../assets/images/dreaming_fox_with_a_pillow.png";
import Footer from "../../components/shared/Footer/Footer";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import Page from "src/components/shared/Page/Page";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import { useOpenAiGPTContext } from "src/components/StoryCreator/features/OpenAiGPT/store/Provider";
import { useParams } from "react-router-dom";
import { useViewStoryContext } from "./store/Provider";

const ViewStoryPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();

  const {
    store: {
      state: { isFetching, story },
      handleIsFetching,
      handleUpdateStory,
    },
    manager: { setUp },
  } = useViewStoryContext();
  const {
    manager: { handleGenerateTextToSpeechRequest },
  } = useOpenAiGPTContext();

  const handleOnCreateAudioClick = async () => {
    handleIsFetching(true);
    if (story.mainStory) {
      try {
        const audioFile = await handleGenerateTextToSpeechRequest(story);
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
    handleIsFetching(false);
  };

  useEffect(() => {
    if (storyId) setUp(storyId);
  }, [storyId]);

  return (
    <Page title="Story | TalePod" className="view-story-page">
      <Container
        className="view-story-container"
        sx={{
          pt: { xs: 4 },
          pb: 4,
        }}
      >
        {isFetching && <LoaderSpinner style={{ position: "fixed" }} />}

        {!story && <NoResultsFound />}

        {story && (
          <Card
            className="view-story-card"
            sx={{
              backgroundColor: "transparent",
            }}
          >
            <Box component="div" className="bg-image-character">
              <img src={DreamingFox} width="100%" />
            </Box>
            <CardContent className="view-story-card-content">
              <Typography
                gutterBottom
                variant="h3"
                component="h3"
                color="primary"
                sx={{ fontSize: { xs: "2rem" } }}
                className="view-story-card-title"
              >
                {story.title}
              </Typography>

              <Typography
                paragraph
                variant="body1"
                className="view-story-card-summary"
              >
                {story.summary}
              </Typography>

              <Divider sx={{ my: 1 }} />

              {!story.audioFile && (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    Create audio for this story
                  </Typography>

                  <Button
                    size="large"
                    type="button"
                    variant="contained"
                    endIcon={<AutoAwesome />}
                    onClick={handleOnCreateAudioClick}
                  >
                    Create Audio
                  </Button>
                </>
              )}

              {story.audioFile && (
                <Box mt={2}>
                  <Typography
                    variant="h5"
                    component="h2"
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

                  <Typography variant="body2" color="textSecondary" mt={2}>
                    Audio created on:{" "}
                    {new Date(story.audioFile.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                Story
              </Typography>

              <ReactMarkdown>{story.mainStory}</ReactMarkdown>

              <ReactMarkdown className="italics bold">
                {story.poem.split(".").join("\n")}
              </ReactMarkdown>
            </CardContent>
          </Card>
        )}
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ViewStoryPage;
