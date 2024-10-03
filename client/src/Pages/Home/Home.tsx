import "./Home.scss";

import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing";
import { useApplicationContext } from "src/application/store/Provider";

// import Features from "./features/Features";
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
        <PersonalizedBedtimeStoryText />
        {/* <Divider /> */}
        <FAQ />
        {/* <Divider /> */}
        {/* <Features /> */}
        {/* <Divider /> */}
        {/* <Testimonials /> */}
        {/* <Divider /> */}
        <Pricing />
      </Box>
    </Page>
  );
};

export default Homepage;
