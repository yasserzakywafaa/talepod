import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Footer from "../../components/shared/Footer/Footer";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import MediaCard from "src/components/shared/MediaCard/MediaCard";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import Page from "src/components/shared/Page/Page";
import { useEffect } from "react";
import { useExploreContext } from "../Explore/store/Provider";

const ExplorePage: React.FC = () => {
  const {
    store: {
      state: { isFetching, stories },
    },
    manager: { setUp },
  } = useExploreContext();

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Page title="TalePod | Public Bedtime Stories" className="explore-page">
      <Container
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          pt: { xs: 10 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

        {stories.length &&
          stories.map((story, index) => {
            return <MediaCard key={index} story={story} />;
          })}

        {!stories.length && <NoResultsFound />}
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ExplorePage;
