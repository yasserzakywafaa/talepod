import {
  ChildCareOutlined,
  DevicesOutlined,
  EmojiObjectsOutlined,
  LocalLibraryOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

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
import { landingPageSeo } from "./landingPageSeo";
import { landingPageSeoProps } from "./landingPageSeoProps";
import routes from "src/application/routes";
import { generatorFaqItems } from "src/shared/content/faqContent";
import { createFAQPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";
import { useMemo } from "react";

const PersonalizedBedtimeStoryGenerator = () => {
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

  const benefitsList = (
    <List>
      <ListItem>
        <ListItemIcon>
          <ChildCareOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Name, age & interests built in"
          secondary="Our personalized bedtime story generator uses your child's details to craft a unique tale every time."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <EmojiObjectsOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Narration & watercolor art"
          secondary="Every generated story includes warm AI narration and soft watercolor illustrations — ready in under a minute."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <DevicesOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="11 languages, kid-safe"
          secondary="Create stories in 11 languages with kid-safe defaults designed for young audiences."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <LocalLibraryOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Comic or long formats"
          secondary="Choose illustrated comic pages or a longer prose story with a cover image."
        />
      </ListItem>
    </List>
  );

  return (
    <Page
      {...landingPageSeoProps(
        landingPageSeo[routes.landingPages.personalizedBedtimeStoryGenerator],
      )}
      className="personalized-bedtime-story-generator-page"
      isLoading={isFetching}
    >

      <Hero
        heroImage={PlayfulBunny}
        pageTitleWhite="Personalized Bedtime Story"
        pageTitleColored="Generator"
        pageHeader="Enter your child's name, age, and interests — get a narrated, illustrated bedtime story in seconds."
      />

      <div className="section">
        <Testimonials />
      </div>

      <PersonalizedBedtimeStoryText
        introducingTalePod="TalePod's personalized bedtime story generator turns a few details about your child into a complete story with narration and watercolor illustrations."
        whyPersonalizeBedtimeStories="help children feel seen and engaged at bedtime. A generator that uses their name, age, and favorite themes makes every story feel made just for them."
        personalizeImage={Unicorn}
        benefitsList={benefitsList}
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
