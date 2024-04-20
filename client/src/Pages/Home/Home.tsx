import { Card, Divider } from "@mui/material";

import Page from "src/components/Page/Page";
import NavigationBar from "src/components/NavigationBar/NavigationBar";
import OpenAiSection from "src/components/sections/OpenAiSection";
import GoogleGeminiSection from "src/components/sections/GoogleGeminiSection";
import "./Home.scss";

const HomePage = () => {
  return (
    <>
      <div className="background-layer home-page">
        {/* {isFetching && <LoaderSpinner style={{ position: "fixed" }} />} */}

        <NavigationBar />

        <Page title="Home page">
          <Card>
            <GoogleGeminiSection />
          </Card>

          <Divider style={{ margin: "2rem 0" }} />

          <Card>
            <OpenAiSection />
          </Card>
        </Page>
      </div>
    </>
  );
};

export default HomePage;
