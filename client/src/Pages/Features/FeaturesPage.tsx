import "./FeaturesPage.scss";

import Benefits from "./features/Benefits"; // Import Benefits
import CallToAction from "./features/CallToAction";
import { Divider, Link as MuiLink } from "@mui/material";
import FAQ from "./features/FAQ";
import Guarantee from "./features/Guarantee"; // Import Guarantee
import Hero from "./features/Hero";
import HowItWorks from "./features/HowItWorks";
import KeyFeatures from "./features/KeyFeatures"; // Import KeyFeatures
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import { homepageSeo } from "../LandingPages/landingPageSeo";
import { landingPageSeoProps } from "../LandingPages/landingPageSeoProps";
import StructuredData from "src/components/shared/StructuredData/StructuredData";
import {
  homepageFaqSchema,
  softwareApplicationSchema,
} from "src/shared/utils/structuredDataSchemas";
import { ParticlesComponent } from "src/components/shared/ParticlesComponent";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import StoryExamples from "./features/StoryExamples"; // Import StoryExamples
import StoryFormats from "./features/StoryFormats";
import Testimonials from "./features/Testimonials"; // Import Testimonials
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import routes from "src/application/routes";
import { Link } from "react-router-dom";

const FeaturesPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const {
    store: {
      state: {
        createStory: { isFetching: isCreateStoryFetching },
      },
    },
  } = useOpenaiContext();

  return (
    <Page
      {...landingPageSeoProps(homepageSeo)}
      className="features-page"
      isLoading={isFetching || isCreateStoryFetching}
      loaderComponentName={
        isCreateStoryFetching ? LoaderComponentNameEnum.CreateStory : undefined
      }
    >
      <StructuredData
        id="software-application-schema"
        data={softwareApplicationSchema}
      />
      <StructuredData
        id="homepage-faq-schema"
        data={homepageFaqSchema}
      />
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticlesComponent />
      </div>

      <Hero />

      <MuiLink
        component={Link}
        to={routes.landingPages.personalizedBedtimeStoryGenerator}
        sx={{
          display: "block",
          textAlign: "center",
          mb: 2,
          fontSize: 14,
        }}
      >
        Try our personalized bedtime story generator
      </MuiLink>

      <div className="section">
        <StoryFormats />
      </div>

      <div className="section">
        <Testimonials />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <PersonalizedBedtimeStoryText />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <KeyFeatures />
      </div>

      <Divider sx={{ width: "50%" }} />

      <Divider sx={{ width: "50%" }} />

      <div className="section" id="how-it-works">
        <HowItWorks />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <StoryExamples />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <Benefits />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        {isDesktop && <PricingTable />}
        {(isTablet || isMobile) && <Pricing />}
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <Guarantee />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <CallToAction />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <FAQ />
      </div>
    </Page>
  );
};

export default FeaturesPage;
