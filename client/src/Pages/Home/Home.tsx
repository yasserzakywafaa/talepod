import "./Home.scss";

import Page from "src/components/shared/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

const HomePage = () => {
  return (
    <>
      <div className="background-layer home-page">
        <Page title="AI Story Creator">
          <StoryCreator />
        </Page>
      </div>
    </>
  );
};

export default HomePage;
