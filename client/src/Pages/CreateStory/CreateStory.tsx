import "./CreateStory.scss";

import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Looks3Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
} from "@mui/icons-material";

import Box from "@mui/material/Box";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

const CreateStoryPage = () => {
  const {
    store: {
      state: { isFetching: isPageFetching },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { isVisible: isPricingModalVisible },
    },
  } = usePricingModalContext();

  const {
    store: {
      state: {
        createAudio: { isFetching: isCreateAudioFetching },
      },
    },
  } = useOpenaiContext();

  return (
    <Page
      title="Create Bedtime Stories | TalePod"
      className="create-story-page"
      // Story-text creation is async and surfaced by the global, non-blocking
      // GenerationProgressChip, so it is intentionally excluded from this
      // page-level loader (only general page + audio fetches block here).
      isLoading={isPageFetching || isCreateAudioFetching}
      loaderComponentName={
        !isPricingModalVisible ? LoaderComponentNameEnum.CreateStory : undefined
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
            Personalize your bedtime story by filling in the required "Name" for
            your child.
          </Typography>
        </Box>

        <StoryCreator />

        <Container sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Tips for Crafting the Perfect Bedtime Story
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <LooksOneOutlined fontSize="large" color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Include Familiar Elements"
                secondary="Incorporate elements from your child's daily life to make the story more relatable."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <LooksTwoOutlined fontSize="large" color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Add a Moral Lesson"
                secondary="Teach valuable lessons through the story to instill good values and behaviors."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Looks3Outlined fontSize="large" color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Keep It Interactive"
                secondary="Encourage your child to participate in the story to keep them engaged."
              />
            </ListItem>
          </List>
        </Container>
      </Container>
    </Page>
  );
};

export default CreateStoryPage;
