import "./StoryCard.scss";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

import { CSSProperties } from "react";
import { HeadphonesOutlined } from "@mui/icons-material";
import { Story } from "src/components/StoryCreator/store/state";
import UserAccountMenuButton from "../ApplicationBar/features/UserAccountButton";
import { VerifiedBadge } from "../VerifiedBadge";
import routes from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useNavigate } from "react-router-dom";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

interface StoryCard {
  story: Story;
  page?: string;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  isStoryLocked?: boolean;
  classNames?: string | string[];
}

const StoryCard = (props: StoryCard) => {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceSize();
  const { audioFile, authorProfile } = props.story;
  const profileInfo = props.story.profileInfo || {};
  const hasDirectionRtl = props.story.profileInfo.language.value === "ar";

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const handleOnCardClick = () => {
    if (props.page && props.page === "my-stories" && props.story.author) {
      navigate(routes.myStory(props.story.author, props.story.slug), {
        replace: false,
      });
    } else {
      navigate(routes.story(props.story.slug), { replace: false });
    }
  };

  const handleOnUpgradeClick = () => handleTogglePricingModal();

  return (
    <Card
      className="story-card"
      sx={{
        mb: 2,
        boxShadow: (theme) => `0px 2px 0px ${theme.palette.secondary.main}`,
        ":hover": {
          boxShadow: (theme) => `2px 2px 3px ${theme.palette.primary.main}`,
          transform: "scale(1.01)",
          transition: "200ms",
        },
      }}
      onClick={props.isStoryLocked ? undefined : handleOnCardClick}
    >
      {props.isStoryLocked && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="story-card-locked-overlay"
        >
          <Box className="story-card-locked-overlay-verified-icon">
            <VerifiedBadge fontSize={20} />
          </Box>

          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="upgrade"
            variant="contained"
            onClick={handleOnUpgradeClick}
          >
            Upgrade
          </Button>
        </Box>
      )}

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
        <Grid
          container
          spacing={2}
          paddingX={1}
          className="story-card-tags-wrapper"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid
            item
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            className="story-card-tags"
          >
            {audioFile && audioFile.url && (
              <Chip
                size="small"
                variant="outlined"
                label="Original"
                color="primary"
                className="story-card-tags-item"
                icon={<HeadphonesOutlined />}
              />
            )}

            {/* {(profileInfo.gender === ChildGenderEnum.Girl ||
              profileInfo.gender === AdultGenderEnum.Female) && (
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                className="story-card-tags-item"
                label={<FemaleOutlined />}
              />
            )}

            {(profileInfo.gender === ChildGenderEnum.Boy ||
              profileInfo.gender === AdultGenderEnum.Male) && (
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                label={<MaleOutlined />}
                className="story-card-tags-item"
              />
            )} */}

            {profileInfo.language && (
              <Chip
                size="small"
                variant="outlined"
                className="story-card-tags-item"
                color="secondary"
                label={profileInfo.language.value.toUpperCase()}
              />
            )}

            {!props.story.storyParams.createdByAdmin &&
              props.story.createdAt && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={new Date(props.story.createdAt).toLocaleString(
                    "en-GB",
                    {
                      timeStyle: "short",
                      dateStyle: "short",
                    }
                  )}
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
          </Grid>

          <Grid item>
            {authorProfile &&
              (isDesktop ? (
                <UserAccountMenuButton
                  user={authorProfile}
                  navigateToProfile={false}
                />
              ) : (
                <Avatar
                  variant="square"
                  alt="User Picture"
                  src={authorProfile.picture}
                />
              ))}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default StoryCard;
