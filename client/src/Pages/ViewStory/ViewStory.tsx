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
    },
    manager: { setUp },
  } = useViewStoryContext();
  const {
    manager: { handleGenerateTextToSpeechRequest },
  } = useOpenAiGPTContext();

  const handleOnCreateAudioClick = () => {
    handleGenerateTextToSpeechRequest(story.mainStory);
  };

  useEffect(() => {
    if (storyId) setUp(storyId);
  }, [storyId]);

  return (
    <Page title="TalePod | Public Bedtime Stories" className="view-story-page">
      <Container
        className="view-story-container"
        sx={{
          pt: { xs: 4 },
          pb: 4,
        }}
      >
        {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

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

              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                Story
              </Typography>

              <ReactMarkdown>{story.mainStory}</ReactMarkdown>

              <Divider sx={{ my: 2 }} />

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
                <Box mt={4}>
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
                    Audio File: {story.audioFile.fileName} (Created on:{" "}
                    {new Date(story.audioFile.createdAt).toLocaleDateString()})
                  </Typography>
                </Box>
              )}
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
