import "./Home.scss";

import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

const HomePage = () => {
  return (
    <Page title="AI Story Creator" className="home-page">
      <StoryCreator />
    </Page>
  );
};

export default HomePage;
