import "./CreateStory.scss";

import Box from "@mui/material/Box";
import Footer from "../../components/shared/Footer/Footer";
import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

const CreateStoryPage = () => {
  return (
    <Page title="TalePod | Create Bedtime Stories" className="home-page">
      <StoryCreator />

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default CreateStoryPage;
