import "./MyStories.scss";

import { Box, Typography } from "@mui/material";

import CutePuppy from "../../assets/images/cute_puppy_with_sparkling_eyes.webp";
import Page from "src/components/shared/Page/Page";

const MyStoriesPage = () => {
  return (
    <>
      <Box component="div" className="my-stories-page">
        <Page title="My Bedtime Stories | TalePod">
          <Box
            sx={{ p: 3 }}
            display="flex"
            component="div"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className="my-stories-card-wrapper "
          >
            <Box component="div" className="my-stories-image">
              <img src={CutePuppy} width="100%" />
            </Box>

            <Box
              marginY={4}
              display="flex"
              component="div"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              className="unauthorized-card-wrapper"
            >
              <Typography variant="h5" textAlign="center">
                My Stories Page
              </Typography>
            </Box>
          </Box>
        </Page>
      </Box>
    </>
  );
};

export default MyStoriesPage;
