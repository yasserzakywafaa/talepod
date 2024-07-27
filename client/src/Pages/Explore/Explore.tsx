import "./Explore.scss";

import { FilterAltOutlined, SwapVertOutlined } from "@mui/icons-material";
import { Badge, Button, Container, Pagination } from "@mui/material";

import Box from "@mui/material/Box";
import FiltersPanel from "./features/FiltersPanel/FiltersPanel";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import StoryCard from "src/components/shared/StoryCard/StoryCard";
import { useEffect } from "react";
import { useExploreContext } from "../Explore/store/Provider";
import { useNavigate } from "react-router-dom";
import NoStoriesFound from "./features/NoStoriesFound";
import Share from "src/components/shared/Share";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, stories, activeFiltersCount, pagingInfo },
    },
    manager: {
      setUp,
      handleSortStories,
      handleClearFilters,
      handleResetFilters,
      handleGetStoriesByPage,
      handleToggleFiltersPanel,
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

  const handlePaginationItemClick = async (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    if (pageNumber !== pagingInfo.pageNumber) {
      await handleGetStoriesByPage(pageNumber);
    }
  };

  useEffect(() => {
    setUp();

    return () => {
      handleResetFilters();
    };
  }, []);

  return (
    <Page
      title="Explore Bedtime Stories | Talepod"
      className="explore-page"
      isLoading={isFetching}
    >
      <FiltersPanel />

      <Box component="div" className="bg-image-character">
        <RandomImage />
      </Box>

      <Container className="explore-container">
        {/* Filters */}
        {!isFetching && (
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
        )}

        {stories.length !== 0 && (
          <>
            {/* Stories List */}
            <Box
              className="explore-container-snap-area"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                pt: { xs: 0, sm: 1 },
                pb: { xs: 2, sm: 2 },
              }}
            >
              {stories.map((story, index) => {
                return <StoryCard key={index} story={story} />;
              })}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: { xs: 0, sm: 1 },
              }}
            >
              {pagingInfo.totalPagesCount && pagingInfo.totalPagesCount > 1 ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    size="large"
                    color="primary"
                    shape="rounded"
                    variant="outlined"
                    page={pagingInfo.pageNumber}
                    count={pagingInfo.totalPagesCount}
                    onChange={handlePaginationItemClick}
                  />
                </Box>
              ) : (
                <></>
              )}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: { xs: 1, sm: 1 },
                }}
              >
                <Share />
              </Box>
            </Box>
          </>
        )}

        {/* No Stories Found */}
        {!stories.length && (
          <NoStoriesFound
            handleOnCreateClick={handleOnCreateClick}
            handleClearFilters={handleClearFilters}
          />
        )}
      </Container>
    </Page>
  );
};

export default ExplorePage;
