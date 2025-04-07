import "./Features.scss";

import Box from "@mui/material/Box";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const FeaturesPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  return (
    <Page
      title="TalePod - The Ultimate Bedtime Stories Creator"
      className="home-page"
      isLoading={isFetching}
    >
      <Hero />

      <Box sx={{ backgroundColor: "transparent" }}>
        {/* <div className="section">
          <Testimonials />
        </div> */}

        <div className="section">
          <PersonalizedBedtimeStoryText />
        </div>

        <div className="section">
          <FAQ />
        </div>

        <div className="section">
          {isDesktop && <PricingTable />}
          {(isTablet || isMobile) && <Pricing />}
        </div>
      </Box>
    </Page>
  );
};

export default FeaturesPage;
