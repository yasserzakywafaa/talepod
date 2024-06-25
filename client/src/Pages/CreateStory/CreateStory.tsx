import "./CreateStory.scss";

import Box from "@mui/material/Box";
import DreamingGiraffe from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.png";
import Footer from "../../components/shared/Footer/Footer";
import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

const CreateStoryPage = () => {
  return (
    <Page
      title="Create Bedtime Stories | TalePod"
      className="create-story-page"
    >
      <Box component="div" className="bg-image-character">
        <img src={DreamingGiraffe} width="100%" />
      </Box>

      <StoryCreator />

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default CreateStoryPage;
