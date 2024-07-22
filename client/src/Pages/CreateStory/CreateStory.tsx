import "./CreateStory.scss";

import { Container, Typography } from "@mui/material";

import Box from "@mui/material/Box";
import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.png";
import { useApplicationContext } from "src/application/store/Provider";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";

const CreateStoryPage = () => {
  const {
    store: {
      state: { isFetching: isPageFetching },
    },
  } = useApplicationContext();

  const {
    store: {
      state: {
        createStory: { isFetching: isCreateStoryFetching },
        createAudio: { isFetching: isCreateAudioFetching },
      },
    },
  } = useOpenaiContext();

  return (
    <Page
      title="Create Bedtime Stories | TalePod"
      className="create-story-page"
      noSwipeToRefresh={true}
      isLoading={
        isPageFetching || isCreateStoryFetching || isCreateAudioFetching
      }
    >
      <Container>
        <Box component="div" className="bg-image-character">
          <img src={Unicorn} width="100%" />
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 30 },
              mt: 2,
              mb: 1,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            Define your story
          </Typography>

          <Typography variant="subtitle1">
            Personalize bedtime story by filling in the details below. The name
            is required, and the rest of the fields are optional to customize
            your story.
          </Typography>
        </Box>

        <StoryCreator />
      </Container>
    </Page>
  );
};

export default CreateStoryPage;
