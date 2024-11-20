import "./Blogs.scss";

import { Box, Container, Typography } from "@mui/material";

import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { useBlogsContext } from "./store/Provider";

const BlogsPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useBlogsContext();

  return (
    <Page
      title="Blogs | TalePod"
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
          Blogs
        </Typography>
      </Container>
    </Page>
  );
};

export default BlogsPage;
