import "./Blog.scss";

import { Box, Container, Typography } from "@mui/material";

import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { useBlogContext } from "./store/Provider";

const BlogPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useBlogContext();

  return (
    <Page
      title="Blog | TalePod"
      className="contact-page"
      isLoading={isFetching}
    >
      <Box component="div" className="bg-image-character">
        <RandomImage />
      </Box>

      <Container
        className="view-story-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Blog
        </Typography>
      </Container>
    </Page>
  );
};

export default BlogPage;
