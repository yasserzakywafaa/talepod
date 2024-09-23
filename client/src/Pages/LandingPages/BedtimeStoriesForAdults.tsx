import {
  BedOutlined,
  DevicesOutlined,
  EditOutlined,
  FaceOutlined,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FAQ from "./features/FAQ";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import { useApplicationContext } from "src/application/store/Provider";

const BedtimeStoriesForAdults = () => {
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
      title="TALEPOD"
      className="bedtime-stories-for-adults-page"
      isLoading={isFetching}
    >
      <Hero
        pageTitleWhite="Create Relaxing"
        pageTitleColored="Bedtime Stories for Adults"
        pageHeader="Enjoy peaceful and personalized stories to wind down after a long day."
      />

      <Box sx={{ backgroundColor: "transparent" }}>
        <PersonalizedBedtimeStoryText
          whyPersonalizeBedtimeStories="whether you're seeking calm or adventure, TalePod offers stories that cater to your mood and preferences."
          introducingTalePod="TalePod lets adults create their own bedtime stories or enjoy pre-made stories designed for relaxation and peace. Unwind with a story that suits your personal taste."
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

export default BedtimeStoriesForAdults;
