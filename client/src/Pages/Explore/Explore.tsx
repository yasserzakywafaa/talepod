import "./Explore.scss";

import {
  AutoFixHighOutlined,
  FilterAltOffOutlined,
  FilterAltOutlined,
  SwapVertOutlined,
} from "@mui/icons-material";
import { Badge, Button, Container } from "@mui/material";

import Box from "@mui/material/Box";
import DreamingGiraffe from "../../assets/images/dreaming_giraffe_with_a_pillow.png";
import FiltersPanel from "./features/FiltersPanel/FiltersPanel";
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
      state: { isFetching, filteredStories, activeFiltersCount },
    },
    manager: {
      setUp,
      handleToggleFiltersPanel,
      handleSortStories,
      handleClearFilters,
    },
  } = useExploreContext();

  const handleOnCreateClick = () => {
    navigate("/create");
  };

  const handleFilterButtonClick = () => {
    handleToggleFiltersPanel(true);
  };

  const handleSortButtonClick = () => {
    handleSortStories();
  };

  useEffect(() => {
    setUp();

    return () => {
      handleClearFilters();
    };
  }, []);

  return (
    <Page title="Explore Stories | Talepod" className="explore-page">
      <FiltersPanel />

      <Container className="explore-container">
        {!isFetching && filteredStories.length ? (
          <Box
            mb={1}
            display="flex"
            alignItems="center"
            mt={{ xs: 0, sm: 2 }}
            className="explore-top-bar"
            justifyContent={{ xs: "space-between", sm: "end" }}
          >
            <Button
              variant="text"
              endIcon={<SwapVertOutlined />}
              onClick={handleSortButtonClick}
            >
              Sort
            </Button>

            <Button variant="text" onClick={handleFilterButtonClick}>
              Filters
              {activeFiltersCount ? (
                <Badge badgeContent={activeFiltersCount} color="secondary">
                  <FilterAltOutlined color="primary" />
                </Badge>
              ) : (
                <FilterAltOutlined color="primary" />
              )}
            </Button>
          </Box>
        ) : (
          <></>
        )}

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

          {!isFetching && filteredStories.length ? (
            <>
              <Box component="div" className="bg-image-character">
                <img src={DreamingGiraffe} width="100%" />
              </Box>

              {filteredStories.map((story, index) => {
                return <StoryCard key={index} story={story} />;
              })}
            </>
          ) : (
            <></>
          )}

          {!isFetching && !filteredStories.length ? (
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
                  sx={{ my: 2, mx: 1, px: 2 }}
                  endIcon={<AutoFixHighOutlined />}
                  onClick={handleOnCreateClick}
                >
                  Create Story
                </Button>

                <Button
                  size="large"
                  color="primary"
                  variant="outlined"
                  sx={{ my: 2, mx: 1, px: 2 }}
                  endIcon={<FilterAltOffOutlined />}
                  onClick={handleClearFilters}
                >
                  Clear Filters
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
