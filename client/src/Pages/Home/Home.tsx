import "./Home.scss";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Features from "./features/Features";
import Footer from "./features/Footer";
// import Hero from "./features/Hero";
// import Highlights from "./features/Highlights";
import Page from "src/components/shared/Page/Page";
import Pricing from "./features/Pricing";
import StoryCreator from "src/components/StoryCreator/StoryCreator";

// import Testimonials from "./features/Testimonials";

const Homepage = () => {
  return (
    <Page title="AI Story Creator" className="home-page">
      {/* <Hero /> */}

      <StoryCreator />

      <Box sx={{ bgcolor: "background.default" }}>
        <Features />

        <Divider />

        {/* <Testimonials /> */}

        {/* <Divider /> */}
        {/* <Highlights /> */}

        <Divider />

        <Pricing />

        <Divider />

        <FAQ />

        <Divider />

        <Footer />
      </Box>
    </Page>
  );
};

export default Homepage;
