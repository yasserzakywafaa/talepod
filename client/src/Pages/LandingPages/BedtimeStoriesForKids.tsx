import {
  ChildCareOutlined,
  DevicesOutlined,
  EmojiObjectsOutlined,
  LocalLibraryOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import PlayfulBunny from "../../assets/images/landing_pages/playful_bunny.webp";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";

const BedtimeStoriesForKids = () => {
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
          <EmojiObjectsOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Encourages Creativity"
          secondary="TalePod inspires creativity in both parents and children, encouraging them to imagine and explore new worlds together."
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
          <LocalLibraryOutlined fontSize="large" color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary="Promotes Literacy"
          secondary="Personalized stories can enhance your child's vocabulary and comprehension skills, promoting a love for reading from an early age."
        />
      </ListItem>
    </List>
  );

  return (
    <Page
      title="Bedtime Stories for Kids | TALEPOD"
      className="home-page"
      isLoading={isFetching}
    >
      <Hero
        heroImage={PlayfulBunny}
        pageTitleWhite="Create Magical"
        pageTitleColored="Bedtime Stories for Kids"
        pageHeader="Craft personalized bedtime stories tailored to your child's dreams and imagination."
      />

      <Box sx={{ backgroundColor: "transparent" }}>
        <PersonalizedBedtimeStoryText
          whyPersonalizeBedtimeStories="make
              bedtime more engaging and enjoyable, providing a unique way to
              spark your child's imagination. TalePod allows you to create
              custom stories tailored to your child's preferences, making each
              night a special adventure."
          introducingTalePod="With TalePod, you can craft unique narratives that
              resonate with your child's interests, ensuring an exciting and
              immersive bedtime experience"
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

export default BedtimeStoriesForKids;
