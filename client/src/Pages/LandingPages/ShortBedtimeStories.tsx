import {
  BedOutlined,
  DevicesOutlined,
  EditOutlined,
  FaceOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
import ChickBird from "../../assets/images/landing_pages/chick_bird.webp";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";

const ShortBedtimeStories = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  const benefitsList = (
    <List>
      <ListItem>
        <ListItemIcon>
          <FaceOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Tailored to Your Relaxation Needs"
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
      title="Quick Bedtime Stories | TALEPOD"
      className="short-bedtime-stories-page"
      isLoading={isFetching}
    >
      <Hero
        heroImage={ChickBird}
        pageTitleWhite="Quick Bedtime Stories"
        pageTitleColored="for Busy Nights"
        pageHeader="Enjoy short, engaging stories that are perfect for a quick bedtime routine."
      />

      <Box sx={{ backgroundColor: "transparent" }}>
        <PersonalizedBedtimeStoryText
          whyPersonalizeBedtimeStories="offer the perfect solution for busy nights when time is limited, but the importance of bonding remains high."
          introducingTalePod="TalePod lets you create quick and engaging stories for those nights when time is short but imagination is still needed."
          personalizeImage={Unicorn}
          benefitsList={benefitsList}
          benefitsImage={<RandomImage />}
        />
        <FAQ />
        <Pricing />
      </Box>
    </Page>
  );
};

export default ShortBedtimeStories;
