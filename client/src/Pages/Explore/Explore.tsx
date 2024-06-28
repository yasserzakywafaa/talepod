import "./Explore.scss";

import { Button, Container } from "@mui/material";

import { AutoFixHigh, FilterAlt, SwapVert } from "@mui/icons-material";
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
import FiltersPanel from "./features/FiltersPanel/FiltersPanel";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, stories, filteredStories },
    },
    manager: { setUp, toggleFiltersPanel, sortStories },
  } = useExploreContext();

  const handleOnCreateClick = () => {
    navigate("/create");
  };

  const handleFilterButtonClick = () => {
    toggleFiltersPanel(true);
  };

  const handleSortButtonClick = () => {
    sortStories();
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Page title="Explore Stories | Talepod" className="explore-page">
      <FiltersPanel />

      <Container className="explore-container">
        <Box
          my={1}
          // display="flex"
          // TODO: Remove "none" when filtering is ready.
          display="none" 
          alignItems="center"
          justifyContent={{ xs: "space-between", sm: "end" }}
          className="explore-top-bar"
        >
          <Button
            variant="text"
            endIcon={<SwapVert />}
            onClick={handleSortButtonClick}
          >
            Sort
          </Button>

          <Button
            variant="text"
            endIcon={<FilterAlt />}
            onClick={handleFilterButtonClick}
          >
            Filters
          </Button>
        </Box>

        <Box
          className="explore-container-snap-area"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            pt: { xs: 0, sm: 1 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

          {/* {!isFetching && stories.length ? ( */}
          {!isFetching && filteredStories.length ? (
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
                  Create Story
                </Button>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </Page>
  );
};

export default ExplorePage;
