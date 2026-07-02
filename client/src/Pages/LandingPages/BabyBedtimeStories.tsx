import {
  BedOutlined,
  
  ChildCareOutlined,
  DevicesOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Hero from "./features/Hero";
import MonkeyHoldingBanana from "../../assets/images/landing_pages/monkey_holding_banana.webp";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { ParticlesComponent } from "src/components/shared/ParticlesComponent";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import Benefits from "../Features/features/Benefits";
import Guarantee from "../Features/features/Guarantee";
import HowItWorks from "../Features/features/HowItWorks";
import KeyFeatures from "../Features/features/KeyFeatures";
import StoryExamples from "../Features/features/StoryExamples";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import FAQ from "../Features/features/FAQ";
import Testimonials from "../Features/features/Testimonials";
import CallToAction from "../Features/features/CallToAction";
import { landingPageSeo } from "./landingPageSeo";
import { landingPageSeoProps } from "./landingPageSeoProps";
import routes from "src/application/routes";

const BabyBedtimeStories = () => {
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
      {...landingPageSeoProps(
        landingPageSeo[routes.landingPages.babyBedtimeStories],
      )}
      className="baby-bedtime-stories-page"
      isLoading={isFetching}
    >
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticlesComponent />
      </div>

      <Hero
        heroImage={MonkeyHoldingBanana}
        pageTitleWhite="Gentle Bedtime Stories"
        pageTitleColored="for Babies"
        pageHeader="Soft, soothing stories designed to lull your baby to sleep."
      />

      <div className="section">
        <Testimonials />
      </div>

      <PersonalizedBedtimeStoryText
        whyPersonalizeBedtimeStories="for babies respond well to soft and calming stories, making bedtime a gentle experience for both you and your baby."
        introducingTalePod="TalePod helps you create peaceful and soothing stories that are perfect for babies at bedtime."
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

export default BabyBedtimeStories;
