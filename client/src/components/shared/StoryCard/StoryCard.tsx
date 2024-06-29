import "./StoryCard.scss";

import {
  AdultGenderEnum,
  ChildGenderEnum,
  Story,
} from "src/components/StoryCreator/store/state";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import {
  FemaleOutlined,
  HeadphonesOutlined,
  MaleOutlined,
} from "@mui/icons-material";

import { CSSProperties } from "react";
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
  const { audioFile } = props.story;
  const profileInfo = props.story.profileInfo || {};

  const handleOnViewClick = () => {
    navigate(routes.story(props.story._id));
  };

  return (
    <Card
      className="story-card"
      sx={{
        mb: 2,
        cursor: "pointer",
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
          display="flex"
          className="story-card-tags"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pl: 1, pr: 2, width: "100%" }}
          color={theme.palette.secondary.main}
        >
          <Box
            display="flex"
            className="story-card-tags"
            justifyContent="space-between"
            sx={{ mr: 2 }}
          >
            {audioFile && audioFile.url && (
              <HeadphonesOutlined
                fontSize="small"
                className="story-card-tags-item"
              />
            )}

            {(profileInfo.gender === ChildGenderEnum.Girl ||
              profileInfo.gender === AdultGenderEnum.Female) && (
              <FemaleOutlined
                fontSize="small"
                className="story-card-tags-item"
              />
            )}

            {(profileInfo.gender === ChildGenderEnum.Boy ||
              profileInfo.gender === AdultGenderEnum.Male) && (
              <MaleOutlined fontSize="small" className="story-card-tags-item" />
            )}

            {profileInfo.language && (
              <span>{profileInfo.language.value.toUpperCase()}</span>
            )}
          </Box>

          {props.story.createdAt && (
            <Typography variant="body2">
              {new Date(props.story.createdAt).toLocaleDateString("en-GB")}
            </Typography>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default StoryCard;
