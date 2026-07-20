import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import PlayfulBunny from "../../assets/images/landing_pages/playful_bunny.webp";
import { useApplicationContext } from "src/application/store/Provider";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import Benefits from "../Features/features/Benefits";
import Guarantee from "../Features/features/Guarantee";
import HowItWorks from "../Features/features/HowItWorks";
import KeyFeatures from "../Features/features/KeyFeatures";
import StoryExamples from "../Features/features/StoryExamples";
import Testimonials from "../Features/features/Testimonials";
import CallToAction from "../Features/features/CallToAction";
import GeneratorFaq from "./features/GeneratorFaq";
import routes from "src/application/routes";
import { generatorFaqItems } from "src/shared/content/faqContent";
import { createFAQPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";
import { useMemo } from "react";
import { useLandingPageSeo } from "src/shared/i18n/useLandingPageSeo";
import { useTranslation } from "react-i18next";

const PersonalizedBedtimeStoryGenerator = () => {
  const { t } = useTranslation("landing");
  const seoProps = useLandingPageSeo("generator");
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const faqSchema = useMemo(
    () =>
      createFAQPageSchema(
        generatorFaqItems,
        routes.landingPages.personalizedBedtimeStoryGenerator,
      ),
    [],
  );

  useSchemaOrg(faqSchema, "faq-page-schema");

  return (
    <Page
      {...seoProps}
      className="personalized-bedtime-story-generator-page"
      isLoading={isFetching}
    >
      <Hero
        heroImage={PlayfulBunny}
        pageTitleWhite={t("pages.generator.heroWhite")}
        pageTitleColored={t("pages.generator.heroColored")}
        pageHeader={t("pages.generator.heroHeader")}
      />

      <div className="section">
        <Testimonials />
      </div>

      <PersonalizedBedtimeStoryText
        pageKey="generator"
        personalizeImage={Unicorn}
        benefitsImage={<RandomImage />}
      />

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
        <GeneratorFaq />
      </div>
    </Page>
  );
};

export default PersonalizedBedtimeStoryGenerator;
