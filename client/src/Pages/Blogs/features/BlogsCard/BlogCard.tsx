import "./BlogCard.scss";

import { Box, Card, CardContent, Typography } from "@mui/material";

import { ArticleOutlined } from "@mui/icons-material";
import { Blog } from "src/Pages/Blog/store/state";
import { CSSProperties } from "react";
// import RandomImage from "src/components/shared/RandomImage/RandomImage";
import routes from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useNavigate } from "react-router-dom";

interface BlogCard {
  blog: Blog;
  page?: string;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  isStoryLocked?: boolean;
  classNames?: string | string[];
}

const StoryCard = (props: BlogCard) => {
  const navigate = useNavigate();
  const { isDesktop, isMobile } = useDeviceSize();
  const hasDirectionRtl = props.blog.language === "ar";

  const handleOnCardClick = () => {
    navigate(routes.blog(props.blog.slug), { replace: false });
  };

  return (
    <Card
      className="blog-card"
      sx={{
        mb: 2,
        ":hover": {
          boxShadow: (theme) => `2px 2px 3px ${theme.palette.primary.main}`,
          transform: "scale(1.01)",
          transition: "200ms",
        },
      }}
      onClick={props.isStoryLocked ? undefined : handleOnCardClick}
    >
      <CardContent
        className="blog-card-content"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isMobile && (
          <Box className="blog-card-content-image" sx={{ width: "10%", mr: 1 }}>
            <ArticleOutlined color="primary" sx={{ fontSize: "3rem" }} />
          </Box>
        )}

        <Box
          className="blog-card-content-text"
          sx={{ width: !isMobile ? "85%" : "100%" }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className={`blog-card-title ${!isDesktop ? "ellipsis" : ""} ${
              hasDirectionRtl ? "direction-rtl" : ""
            }`}
          >
            {props.blog.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className={`blog-card-summary ${
              hasDirectionRtl ? "direction-rtl" : ""
            }`}
          >
            {props.blog.introduction}
          </Typography>
        </Box>
      </CardContent>

      {/* <CardActions>
        <Box
          display="flex"
          className="blog-card-tags"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pl: 1,
            pr: 1,
            width: "100%",
            color: (theme) => theme.palette.secondary.main,
          }}
        >
        </Box>
      </CardActions> */}
    </Card>
  );
};

export default StoryCard;
