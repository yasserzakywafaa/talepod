import { Badge, Box, Button, Container, Pagination } from "@mui/material";

import { FilterAltOutlined } from "@mui/icons-material";
import FiltersPanel from "./features/FiltersPanel/FiltersPanel";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import NoStoriesFound from "./features/NoStoriesFound";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Share from "src/components/shared/Share/Share";
import StoryCard from "src/components/shared/StoryCard/StoryCard";
import { useExploreContext } from "./store/Provider";
import { useNavigate } from "react-router-dom";

interface ExplorePageContentProps {
  storiesToDisplay?: "originals" | "users";
}

export const ExploreContent = (props: ExplorePageContentProps): JSX.Element => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, stories, activeFiltersCount, pagingInfo },
    },
    manager: {
      handleClearFilters,
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

  // const handleSortButtonClick = () => {
  //   handleSortStories();
  // };

  const handlePaginationItemClick = async (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    if (pageNumber !== pagingInfo.pageNumber) {
      await handleGetStoriesByPage(pageNumber);
    }
  };

  return (
    <Page
      isLoading={isFetching || (isFetching && !stories.length)}
      // isLoading={isFetching}
      // isLoading={!isFetching}
      className="explore-page"
      title="Explore Bedtime Stories on TalePod"
      loaderComponentName={LoaderComponentNameEnum.BedtimeStories}
    >
      <Container className="explore-container">
        {/* Modals */}
        <FiltersPanel />

        {/* Filters */}
        {!isFetching && (
          <Box
            mb={1}
            display="flex"
            alignItems="center"
            justifyContent="end"
            mt={{ xs: 0, sm: 2 }}
            className="explore-top-bar"
          >
            {/* <Button
              variant="text"
              endIcon={<SwapVertOutlined />}
              onClick={handleSortButtonClick}
            >
              Sort
            </Button> */}

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

        {stories.length ? (
          <>
            <Box component="div" className="bg-image-character">
              <RandomImage />
            </Box>

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
              className="explore-footer"
            >
              {pagingInfo.totalPagesCount && pagingInfo.totalPagesCount > 1 ? (
                <Pagination
                  size="medium"
                  color="primary"
                  shape="rounded"
                  variant="outlined"
                  page={pagingInfo.pageNumber}
                  count={pagingInfo.totalPagesCount}
                  onChange={handlePaginationItemClick}
                />
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
        ) : (
          <></>
        )}

        {/* No Stories Found */}
        {!isFetching && !stories.length ? (
          <NoStoriesFound
            handleOnCreateClick={handleOnCreateClick}
            handleClearFilters={handleClearFilters}
          />
        ) : (
          <></>
        )}
      </Container>
    </Page>
  );
};
