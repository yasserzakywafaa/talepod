import {
  BedOutlined,
  ChildCareOutlined,
  DevicesOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
import CuteKuala from "../../assets/images/landing_pages/cute_kuala.webp";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";

const BedtimeStoriesForToddlers = () => {
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
      title="Bedtime Stories for Toddlers | TalePod"
      className="bedtime-stories-for-toddlers-page"
      isLoading={isFetching}
    >
      <Hero
        heroImage={CuteKuala}
        pageTitleWhite="Fun and Engaging"
        pageTitleColored="Bedtime Stories for Toddlers"
        pageHeader="Create short, fun stories that are perfect for your little one."
      />

      <Box sx={{ backgroundColor: "transparent" }}>
        <PersonalizedBedtimeStoryText
          whyPersonalizeBedtimeStories="engage their senses and keep them entertained. Personalized stories make bedtime more enjoyable for the youngest ones."
          introducingTalePod="TalePod offers a variety of toddler-friendly stories that are short, engaging, and tailored to their developmental stage."
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

export default BedtimeStoriesForToddlers;
