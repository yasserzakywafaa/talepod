import "./Blog.scss";

import { Box, Card, CardContent, Container, Typography } from "@mui/material";

import NotFound from "../NotFound/NotFound";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import ReactMarkdown from "react-markdown";
import { ShareFloating } from "src/components/shared/Share/ShareFloating";
import { useBlogContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    store: {
      state: { isFetching, blog },
    },
    manager: { setUp },
  } = useBlogContext();

  const hasDirectionRtl = blog && blog.language === "ar";

  useEffect(() => {
    if (slug) setUp(slug);
  }, [slug]);

  return (
    <Page
      title={`${blog && blog.title} | TalePod`}
      className="contact-page"
      isLoading={isFetching}
    >
      <Container
        className="view-blog-container"
        sx={{
          pt: { xs: 1 },
          pb: 4,
        }}
      >
        {!isFetching && !blog && <NotFound />}

        {blog && (
          <>
            <Card
              className="view-blog-card"
              vocab="https://schema.org"
              typeof="ShortBlog"
            >
              <Box component="div" className="bg-image-character">
                <RandomImage />
              </Box>
              <CardContent className="view-blog-card-content">
                <Typography
                  gutterBottom
                  variant="h4"
                  component="h1"
                  color="primary"
                  property="name"
                  className={`view-blog-card-title ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{ fontSize: { xs: "2rem", sm: "2.25rem" } }}
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="h5"
                  component="h2"
                  className={`view-blog-card-summary ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, marginY: 5 }}
                >
                  {blog.introduction}
                </Typography>

                <ShareFloating />

                <Box
                  component="article"
                  className={`view-blog-card-main-blog ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{
                    marginY: 5
                  }}
                >
                  <ReactMarkdown>{blog.mainBlog}</ReactMarkdown>
                </Box>

                <Box
                  component="article"
                  className={`view-blog-card-conclusion ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                >
                  <ReactMarkdown>{blog.conclusion}</ReactMarkdown>
                </Box>

                <Box
                  component="article"
                  className={`bold view-blog-card-callToAction ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                  sx={{
                    marginY: 5
                  }}
                >
                  <ReactMarkdown>{blog.callToAction}</ReactMarkdown>
                </Box>

                {/* <pre className={` ${hasDirectionRtl ? "direction-rtl" : ""}`}>
                  {blog.conclusion}
                </pre> */}

                {/* <Share blog={blog} /> */}
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Page>
  );
};

export default BlogPage;
