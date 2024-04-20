import "./Home.scss";

import NavigationBar from "src/components/NavigationBar/NavigationBar";
import Page from "src/components/Page/Page";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

const HomePage = () => {
  return (
    <>
      <div className="background-layer home-page">
        {/* {isFetching && <LoaderSpinner style={{ position: "fixed" }} />} */}

        <NavigationBar />

        <Page title="AI Story Creator">
          <StoryCreator />
        </Page>
      </div>
    </>
  );
};

export default HomePage;
