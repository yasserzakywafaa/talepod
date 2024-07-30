import "./StoryCard.scss";

import {
  AdultGenderEnum,
  ChildGenderEnum,
  Story,
} from "src/components/StoryCreator/store/state";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import {
  FemaleOutlined,
  HeadphonesOutlined,
  MaleOutlined,
} from "@mui/icons-material";

import { CSSProperties } from "react";
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
  const { audioFile } = props.story;
  const profileInfo = props.story.profileInfo || {};
  const hasDirectionRtl = props.story.profileInfo.language.value === "ar";

  const handleOnCardClick = () => {
    navigate(routes.story(props.story.slug), { replace: false });
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
      onClick={handleOnCardClick}
    >
      <CardContent className="story-card-content">
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className={`story-card-title ${!isDesktop ? "ellipsis" : ""} ${
            hasDirectionRtl ? "direction-rtl" : ""
          }`}
        >
          {props.story.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className={`story-card-summary ${
            hasDirectionRtl ? "direction-rtl" : ""
          }`}
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
          sx={{
            pl: 1,
            pr: 1,
            width: "100%",
            color: (theme) => theme.palette.secondary.main,
          }}
        >
          <Box
            display="flex"
            className="story-card-tags-wrapper"
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
              <span className="story-card-tags-item">
                {" "}
                {profileInfo.language.value.toUpperCase()}
              </span>
            )}
          </Box>

          {props.story.createdAt && (
            <Chip
              size="small"
              variant="outlined"
              label={new Date(props.story.createdAt).toLocaleString("en-GB", {
                timeStyle: "short",
                dateStyle: "short",
              })}
              color="secondary"
            />
          )}

          {props.story.storyParams.createdByAdmin && (
            <Chip
              size="small"
              variant="outlined"
              label="Original"
              color="primary"
            />
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default StoryCard;
