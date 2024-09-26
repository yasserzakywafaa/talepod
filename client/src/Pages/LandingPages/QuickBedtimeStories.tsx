import {
  BedOutlined,
  ChildCareOutlined,
  DevicesOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import SpeedySquirrel from "../../assets/images/landing_pages/speedy_squirrel.webp";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";

const QuickBedtimeStories = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

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
      title="TALEPOD"
      className="best-bedtime-stories-page"
      isLoading={isFetching}
    >
      <Hero
        heroImage={SpeedySquirrel}
        pageTitleWhite="Quick Bedtime Stories"
        pageTitleColored="for Fast Bedtime Routines"
        pageHeader="Short and sweet stories for when time is of the essence."
      />

      <Box sx={{ backgroundColor: "transparent" }}>
        <PersonalizedBedtimeStoryText
          whyPersonalizeBedtimeStories="offer a solution for nights when you need a short yet engaging narrative."
          introducingTalePod="TalePod provides a variety of quick stories that are perfect for wrapping up the day when you’re in a hurry."
          personalizeImage={Unicorn}
          benefitsList={benefitsList}
          benefitsImage={<RandomImage />}
        />
        <Divider />
        <FAQ />
      </Box>
    </Page>
  );
};

export default QuickBedtimeStories;
