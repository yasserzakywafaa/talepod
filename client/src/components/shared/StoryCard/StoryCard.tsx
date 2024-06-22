import "./StoryCard.scss";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import { CSSProperties } from "react";
import { Story } from "src/application/shared/interfaces";
import routes from "src/application/routes";
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
  const maxImgWidth = 500;

  const handleOnViewClick = () => {
    navigate(routes.story(props.story._id));
  };

  return (
    <Card
      className="story-card"
      sx={{
        maxWidth: maxImgWidth,
        mb: 4,
        mr: !isDesktop ? 0 : 4,
        bgcolor: "transparent",
      }}
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
        <Button size="small" variant="outlined" onClick={handleOnViewClick}>
          Read Story
        </Button>
      </CardActions>
    </Card>
  );
};

export default StoryCard;
