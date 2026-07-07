import {
  BedOutlined,
  DevicesOutlined,
  EditOutlined,
  LocalFloristOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import DreamyKitten from "../../assets/images/landing_pages/dreamy_kitten.webp";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import Benefits from "../Features/features/Benefits";
import FAQ from "../Features/features/FAQ";
import Guarantee from "../Features/features/Guarantee";
import HowItWorks from "../Features/features/HowItWorks";
import KeyFeatures from "../Features/features/KeyFeatures";
import StoryExamples from "../Features/features/StoryExamples";
import Testimonials from "../Features/features/Testimonials";
import CallToAction from "../Features/features/CallToAction";
import { landingPageSeo } from "./landingPageSeo";
import { landingPageSeoProps } from "./landingPageSeoProps";
import routes from "src/application/routes";

const BedtimeStoriesForGirlfriend = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const benefitsList = (
    <List>
      <ListItem>
        <ListItemIcon>
          <LocalFloristOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Tailored to Your Romantic Needs"
          secondary="With TalePod, you can choose themes, tones, and characters that match your current mood."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <BedOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Promotes Better Sleep"
          secondary="Calm and personalized stories can help you ease into sleep and relaxation."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <DevicesOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Easy to Use"
          secondary="TalePod's user-friendly interface makes it simple to create and customize stories, even for those who are not tech-savvy."
        />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <EditOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Customizable"
          secondary="TalePod is designed to meet the needs of both adults and children."
        />
      </ListItem>
    </List>
  );

  return (
    <Page
      {...landingPageSeoProps(
        landingPageSeo[routes.landingPages.bedtimeStoriesForGirlfriend],
      )}
      className="bedtime-stories-for-girlfriend-page"
      isLoading={isFetching}
    >

      <Hero
        heroImage={DreamyKitten}
        pageTitleWhite="Heartfelt Bedtime Stories"
        pageTitleColored="for Your Girlfriend"
        pageHeader="Create romantic and personalized stories to share with your loved one."
      />

      <div className="section">
        <Testimonials />
      </div>

      <PersonalizedBedtimeStoryText
        whyPersonalizeBedtimeStories="can strengthen your bond by adding a personal touch to your shared moments."
        introducingTalePod="TalePod lets you craft romantic bedtime stories to surprise and delight your partner, making each night together even more special.."
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
        <FAQ />
      </div>
    </Page>
  );
};

export default BedtimeStoriesForGirlfriend;
