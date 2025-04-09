import "./FeaturesPage.scss";

import Benefits from "./features/Benefits"; // Import Benefits
import CallToAction from "./features/CallToAction";
import FAQ from "./features/FAQ";
import Guarantee from "./features/Guarantee"; // Import Guarantee
import Hero from "./features/Hero";
import HowItWorks from "./features/HowItWorks";
import KeyFeatures from "./features/KeyFeatures"; // Import KeyFeatures
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import StoryExamples from "./features/StoryExamples"; // Import StoryExamples
import Testimonials from "./features/Testimonials"; // Import Testimonials
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";

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
      title="TalePod: AI-powered Bedtime Stories Creator"
      className="features-page"
      isLoading={isFetching || isCreateStoryFetching}
      loaderComponentName={
        isCreateStoryFetching ? LoaderComponentNameEnum.CreateStory : undefined
      }
    >
      <Hero />

      <div className="section">
        <Testimonials />
      </div>

      <div className="section">
        <PersonalizedBedtimeStoryText />
      </div>

      <div className="section">
        <KeyFeatures />
      </div>

      <div className="section">
        <HowItWorks />
      </div>

      <div className="section">
        <StoryExamples />
      </div>

      <div className="section">
        <Benefits />
      </div>

      <div className="section">
        {isDesktop && <PricingTable />}
        {(isTablet || isMobile) && <Pricing />}
      </div>

      <div className="section">
        <Guarantee />
      </div>

      <div className="section">
        <CallToAction />
      </div>

      <div className="section">
        <FAQ />
      </div>
    </Page>
  );
};

export default FeaturesPage;
