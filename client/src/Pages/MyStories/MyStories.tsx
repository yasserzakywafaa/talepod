import "./MyStories.scss";

import { Badge, Button, Container, Grid, Pagination } from "@mui/material";

import Box from "@mui/material/Box";
import { FilterAltOutlined } from "@mui/icons-material";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import MyStoriesFiltersPanel from "./features/MyStoriesFiltersPanel/MyStoriesFiltersPanel";
import NoStoriesFound from "./features/NoStoriesFound";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import StoryCard from "src/components/shared/StoryCard/StoryCard";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useMyStoriesContext } from "../MyStories/store/Provider";
import { useNavigate } from "react-router-dom";

const MyStoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, stories, activeFiltersCount, pagingInfo },
    },
    manager: {
      setUp,
      handleClearFilters,
      handleResetFilters,
      handleGetStoriesByPage,
      handleToggleFiltersPanel,
    },
  } = useMyStoriesContext();

  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const handleOnCreateClick = () => {
    navigate("/create");
  };

  const handleFilterButtonClick = () => {
    handleToggleFiltersPanel(true);
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
      isLoading={isFetching && !stories.length}
      className="my-stories-page"
      title="My Bedtime Stories on TalePod"
      loaderComponentName={LoaderComponentNameEnum.BedtimeStories}
    >
      <Container className="my-stories-container">
        {/* Modals */}
        <MyStoriesFiltersPanel />

        {/* Filters */}
        {!isFetching && (
          <Box
            className="my-stories-top-bar"
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              mt: { xs: 0, sm: 2 }
            }}>
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
              className="my-stories-container-snap-area"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                pt: { xs: 0, sm: 1 },
                pb: { xs: 2, sm: 2 },
              }}
            >
              <Grid container spacing={2}>
                {stories.map((story, index) => {
                  const isStoryLocked = !user?.isPaidUser && story.isPremium;

                  return (
                    <Grid
                      key={index}
                      size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}
                      sx={{ display: "flex" }}
                    >
                      <StoryCard
                        key={index}
                        story={story}
                        page="my-stories"
                        isStoryLocked={isStoryLocked}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: { xs: 0, sm: 1 },
              }}
              className="my-stories-footer"
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

export default MyStoriesPage;
