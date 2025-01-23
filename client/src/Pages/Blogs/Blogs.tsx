import "./Blogs.scss";

import { Box, Container, Pagination } from "@mui/material";

import BlogCard from "./features/BlogsCard/BlogCard";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { useBlogsContext } from "./store/Provider";
import { useEffect } from "react";

const BlogsPage = () => {
  const {
    store: {
      state: { isFetching, blogs, pagingInfo },
    },
    manager: { setUp, handleGetBlogsByPage },
  } = useBlogsContext();

  const handlePaginationItemClick = async (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    if (pageNumber !== pagingInfo.pageNumber) {
      await handleGetBlogsByPage(pageNumber);
    }
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Page
      title="Blogs on TalePod"
      isLoading={isFetching || (isFetching && !blogs.length)}
      className="blogs-page"
    >
      <Container className="blogs-container">
        {blogs.length ? (
          <>
            <Box component="div" className="bg-image-character">
              <RandomImage />
            </Box>

            {/* Blogs List */}
            <Box
              className="blogs-container-snap-area"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                pt: { xs: 0, sm: 2 },
                pb: { xs: 2, sm: 2 },
              }}
            >
              {blogs.map((blog, index) => {
                return <BlogCard key={index} blog={blog} />;
              })}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: { xs: 0, sm: 1 },
              }}
              className="blogs-footer"
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
        {/* {!isFetching && !blogs.length ? (
          <NoStoriesFound
            handleOnCreateClick={handleOnCreateClick}
            handleClearFilters={handleClearFilters}
          />
        ) : (
          <></>
        )} */}
      </Container>
    </Page>
  );
};

export default BlogsPage;
