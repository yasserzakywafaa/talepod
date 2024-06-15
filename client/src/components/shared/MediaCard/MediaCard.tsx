import "./MediaCard.scss";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { CSSProperties } from "react";
import { Story } from "src/application/shared/interfaces";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface MediaCardParams {
  story: Story;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  classNames?: string | string[];
}

const MediaCard = (props: MediaCardParams) => {
  const navigate = useNavigate();
  const maxImgWidth = 500;

  const handleOnViewClick = () => {
    navigate(routes.story(props.story._id));
  };

  return (
    <Card sx={{ maxWidth: maxImgWidth }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="150"
        src={props.image || `https://picsum.photos/${maxImgWidth}/150`}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.story.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.story.summary}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="large" variant="outlined" onClick={handleOnViewClick}>
          View Story
        </Button>
      </CardActions>
    </Card>
  );
};

export default MediaCard;
