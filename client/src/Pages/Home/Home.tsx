import "./Home.scss";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
// import Highlights from "./features/Highlights";
// import Features from "./features/Features";
// import Pricing from "./features/Pricing";
import { useApplicationContext } from "src/application/store/Provider";

// import StoryCreator from "src/components/StoryCreator/StoryCreator";
// import Testimonials from "./features/Testimonials";

const Homepage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  return (
    <Page title="TALEPOD" className="home-page" isLoading={isFetching}>
      <Hero />

      <Box sx={{ backgroundColor: "transparent" }}>
        {/* <Features /> */}
        {/* <Divider /> */}
        {/* <Testimonials /> */}
        {/* <Divider /> */}
        {/* <Highlights /> */}
        {/* <Divider /> */}
        <PersonalizedBedtimeStoryText />
        <Divider />

        {/* <Pricing /> */}
        {/* <Divider /> */}

        <FAQ />
        <Divider />
      </Box>
    </Page>
  );
};

export default Homepage;
