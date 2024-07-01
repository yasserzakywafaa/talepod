import "./Home.scss";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Footer from "../../components/shared/Footer/Footer";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import { useApplicationContext } from "src/application/store/Provider";

// import Highlights from "./features/Highlights";
// import Features from "./features/Features";
// import Pricing from "./features/Pricing";
// import StoryCreator from "src/components/StoryCreator/StoryCreator";
// import Testimonials from "./features/Testimonials";

const Homepage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  return (
    <Page title="TalePod" className="home-page" isLoading={isFetching}>
      <Hero />

      <Box sx={{ bgcolor: "transparent" }}>
        {/* <Features /> */}
        {/* <Divider /> */}
        {/* <Testimonials /> */}
        {/* <Divider /> */}
        {/* <Highlights /> */}
        {/* <Divider /> */}
        {/* <Pricing /> */}
        {/* <Divider /> */}
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </Page>
  );
};

export default Homepage;
