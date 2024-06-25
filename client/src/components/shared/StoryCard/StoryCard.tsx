import "./StoryCard.scss";

import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";

import { CSSProperties } from "react";
import { Headphones } from "@mui/icons-material";
import { Story } from "src/application/shared/interfaces";
import routes from "src/application/routes";
import { theme } from "src/application/shared/themes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useNavigate } from "react-router-dom";

interface StoryCard {
  story: Story;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  classNames?: string | string[];
}

const StoryCard = (props: StoryCard) => {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceSize();

  const handleOnViewClick = () => {
    navigate(routes.story(props.story._id));
  };

  return (
    <Card
      className="story-card"
      sx={{
        mb: 4,
        maxWidth: 500,
        cursor: "pointer",
        mr: !isDesktop ? 0 : 4,
        bgcolor: "transparent",
        ":hover": {
          boxShadow: (theme) => `2px 2px 3px ${theme.palette.primary.main}`,
          transform: "scale(1.01)",
          transition: "200ms",
        },
      }}
      onClick={handleOnViewClick}
    >
      <CardContent className="story-card-content">
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className={`story-card-title ${!isDesktop ? "ellipsis" : ""}`}
        >
          {props.story.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="story-card-summary"
        >
          {props.story.summary}
        </Typography>
      </CardContent>

      <CardActions>
        <Box
          className="card-tags"
          sx={{ pl: 1, pr: 2 }}
          color={theme.palette.secondary.main}
        >
          {props.story.audioFile && props.story.audioFile.url && (
            <Headphones fontSize="small" className="card-tags-item" />
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default StoryCard;
