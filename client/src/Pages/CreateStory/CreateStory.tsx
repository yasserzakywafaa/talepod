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
import { useTranslation } from "react-i18next";

const CreateStoryPage = () => {
  const { t } = useTranslation("story");
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

  const tipIcons = [LooksOneOutlined, LooksTwoOutlined, Looks3Outlined] as const;
  const tipKeys = ["familiar", "moral", "interactive"] as const;

  return (
    <Page
      title={t("createPage.title")}
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
            {t("createPage.heading")}
          </Typography>

          <Typography variant="subtitle1">
            {t("createPage.subheading")}
          </Typography>
        </Box>

        <StoryCreator />

        <Container sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t("createPage.tipsHeading")}
          </Typography>

          <List>
            {tipKeys.map((key, index) => {
              const Icon = tipIcons[index];
              return (
                <ListItem key={key}>
                  <ListItemIcon>
                    <Icon fontSize="large" color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`createPage.tips.${key}.title`)}
                    secondary={t(`createPage.tips.${key}.body`)}
                  />
                </ListItem>
              );
            })}
          </List>
        </Container>
      </Container>
    </Page>
  );
};

export default CreateStoryPage;
