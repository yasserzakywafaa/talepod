import {
  BedOutlined,
  ChildCareOutlined,
  DevicesOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import SpeedySquirrel from "../../assets/images/landing_pages/speedy_squirrel.webp";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { ParticlesComponent } from "src/components/shared/ParticlesComponent";
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

const QuickBedtimeStories = () => {
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
          <ChildCareOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Tailored to Your Child's Interests"
          secondary="With TalePod, you can customize stories based on your child's favorite characters, themes, and settings, making each story relevant and captivating."
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
      title="Quick Bedtime Stories | TalePod"
      className="best-bedtime-stories-page"
      isLoading={isFetching}
    >
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticlesComponent />
      </div>

      <Hero
        heroImage={SpeedySquirrel}
        pageTitleWhite="Quick Bedtime Stories"
        pageTitleColored="for Fast Bedtime Routines"
        pageHeader="Short and sweet stories for when time is of the essence."
      />

      <div className="section">
        <Testimonials />
      </div>
      <PersonalizedBedtimeStoryText
        whyPersonalizeBedtimeStories="offer a solution for nights when you need a short yet engaging narrative."
        introducingTalePod="TalePod provides a variety of quick stories that are perfect for wrapping up the day when you're in a hurry."
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

export default QuickBedtimeStories;
