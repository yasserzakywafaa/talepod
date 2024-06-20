import { Button, Container } from "@mui/material";

import { AutoFixHigh } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Footer from "../../components/shared/Footer/Footer";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import MediaCard from "src/components/shared/MediaCard/MediaCard";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import Page from "src/components/shared/Page/Page";
import { useEffect } from "react";
import { useExploreContext } from "../Explore/store/Provider";
import { useNavigate } from "react-router-dom";

const ExplorePage: React.FC = () => {
  const {
    store: {
      state: { isFetching, stories },
    },
    manager: { setUp },
  } = useExploreContext();

  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate("/create");
  };

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

        {stories.length ? (
          stories.map((story, index) => {
            return <MediaCard key={index} story={story} />;
          })
        ) : (
          <NoResultsFound />
        )}

        <Box>
          <Button
            size="large"
            color="primary"
            variant="contained"
            sx={{ my: 2, px: 2 }}
            endIcon={<AutoFixHigh />}
            onClick={handleStartNowClick}
          >
            Create Another Story
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ExplorePage;
