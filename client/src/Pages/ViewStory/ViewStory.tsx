import { AutoAwesome, AutoFixHigh } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Footer from "../../components/shared/Footer/Footer";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import Page from "src/components/shared/Page/Page";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import { useOpenAiGPTContext } from "src/components/StoryCreator/features/OpenAiGPT/store/Provider";
import { useViewStoryContext } from "./store/Provider";

const ViewStoryPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleStartNowClick = () => {
    navigate("/create");
  };

  const handleOnCreateAudioClick = () => {
    handleGenerateTextToSpeechRequest(story.mainStory);
  };

  useEffect(() => {
    if (storyId) setUp(storyId);
  }, [storyId]);

  return (
    <Page title="TalePod | Public Bedtime Stories" className="explore-page">
      <Container
        sx={{
          pt: { xs: 4 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

        {!story && <NoResultsFound />}

        {story && (
          <Card
            sx={{
              backgroundColor: "transparent",
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                color="primary"
              >
                {story.title}
              </Typography>

              <Typography variant="body1" paragraph>
                {story.summary}
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                Story
              </Typography>
              <ReactMarkdown>{story.mainStory}</ReactMarkdown>

              {!story.audioFile && (
                <>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    Create audio book for this story
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
                    Audio File: {story.audioFile.fileName} (Uploaded on:{" "}
                    {new Date(story.audioFile.createdAt).toLocaleDateString()})
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Box display="flex" justifyContent="center">
          <Button
            size="large"
            color="primary"
            variant="outlined"
            sx={{ my: 2, px: 2 }}
            endIcon={<AutoFixHigh />}
            onClick={handleStartNowClick}
          >
            Create Another Story
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ViewStoryPage;
