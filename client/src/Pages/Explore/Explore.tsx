import "./Explore.scss";

import { Button, Container } from "@mui/material";

import { AutoFixHigh } from "@mui/icons-material";
import Box from "@mui/material/Box";
import DreamingGiraffe from "../../assets/images/dreaming_giraffe_with_a_pillow.png";
import Footer from "../../components/shared/Footer/Footer";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import Page from "src/components/shared/Page/Page";
import StoryCard from "src/components/shared/StoryCard/StoryCard";
import { useEffect } from "react";
import { useExploreContext } from "../Explore/store/Provider";
import { useNavigate } from "react-router-dom";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, stories },
    },
    manager: { setUp },
  } = useExploreContext();

  const handleOnCreateClick = () => {
    navigate("/create");
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Page title="Explore Stories | Talepod" className="explore-page">
      <Container
        className="explore-container"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          pt: { xs: 0, sm: 4 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

        {!isFetching && stories.length ? (
          <>
            <Box component="div" className="bg-image-character">
              <img src={DreamingGiraffe} width="100%" />
            </Box>

            {stories.map((story, index) => {
              return <StoryCard key={index} story={story} />;
            })}
          </>
        ) : (
          <></>
        )}

        {!isFetching && !stories.length ? (
          <>
            <NoResultsFound />

            <Box
              width="100%"
              margin="auto"
              display="flex"
              justifyContent="center"
            >
              <Button
                size="large"
                color="secondary"
                variant="contained"
                sx={{ my: 2, px: 2 }}
                endIcon={<AutoFixHigh />}
                onClick={handleOnCreateClick}
              >
                Create Another Story
              </Button>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ExplorePage;
