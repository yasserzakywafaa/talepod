import "./StoryCard.scss";

import {
  AdultGenderEnum,
  ChildGenderEnum,
  Story,
} from "src/components/StoryCreator/store/state";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";

import {
  FemaleOutlined,
  GraphicEqOutlined,
  MaleOutlined,
} from "@mui/icons-material";

import { CSSProperties } from "react";
import UserAccountMenuButton from "../UserAccountButton";
import { VerifiedBadge } from "../VerifiedBadge";
import mascotBunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import routes from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useNavigate } from "react-router-dom";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { trackEvent } from "src/shared/utils/ga4";

interface StoryCardProps {
  story: Story;
  page?: string;
  image?: string;
  loading?: boolean;
  style?: CSSProperties;
  isStoryLocked?: boolean;
  classNames?: string | string[];
}

/** Cover image for the card: real art if generated, else a watercolor gradient + mascot. */
const getCover = (story: Story): string | undefined =>
  story.coverImageUrl ||
  story.pages?.find((page) => page.imageUrl)?.imageUrl ||
  undefined;

const StoryCard = (props: StoryCardProps) => {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceSize();
  const { audioFile, authorProfile } = props.story;
  const profileInfo = props.story.profileInfo || {};
  const hasDirectionRtl = props.story.profileInfo.language.value === "ar";
  const isComic = props.story.format === "comic";
  const cover = getCover(props.story);

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const handleOnCardClick = () => {
    const sourcePage =
      props.page === "my-stories" ? "my_stories" : "library";

    trackEvent("story_card_click", {
      story_slug: props.story.slug,
      story_format: props.story.format,
      source_page: sourcePage,
    });

    if (props.page && props.page === "my-stories" && props.story.author) {
      navigate(routes.myStory(props.story.author, props.story.slug), {
        replace: false,
      });
    } else {
      navigate(routes.story(props.story.slug), { replace: false });
    }
  };

  return (
    <Box
      className="story-card"
      style={props.style}
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
      onClick={props.isStoryLocked ? undefined : handleOnCardClick}
    >
      {props.isStoryLocked && (
        <Box className="story-card-locked-overlay">
          <Box className="story-card-locked-overlay-verified-icon">
            <VerifiedBadge fontSize={20} />
          </Box>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="upgrade"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              trackEvent("story_upgrade_click", {
                story_slug: props.story.slug,
              });
              handleTogglePricingModal("locked_story");
            }}
          >
            Upgrade
          </Button>
        </Box>
      )}

      {/* Cover */}
      <div className="story-card-cover">
        {cover ? (
          <img src={cover} alt={props.story.title} className="story-card-cover-img" />
        ) : (
          <div className="story-card-cover-placeholder">
            <img src={mascotBunny} alt="" />
          </div>
        )}
        <div className="story-card-cover-badge">
          <Chip
            variant="badge"
            color={isComic ? "primary" : "secondary"}
            label={isComic ? "Comic" : "Story"}
          />
        </div>
        {audioFile && audioFile.url && (
          <div className="story-card-cover-audio" title="Has narration">
            <GraphicEqOutlined sx={{ fontSize: 16, color: "#fff" }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="story-card-content">
        <Typography
          className={`story-card-title ${hasDirectionRtl ? "direction-rtl" : ""}`}
          sx={{ color: "text.primary" }}
        >
          {props.story.title}
        </Typography>
        <Typography
          className={`story-card-summary ${
            hasDirectionRtl ? "direction-rtl" : ""
          }`}
          sx={{ color: "text.secondary" }}
        >
          {props.story.summary}
        </Typography>
      </div>

      {/* Footer meta */}
      <div className="story-card-meta">
        <div className="story-card-tags">
          {profileInfo.language && (
            <Chip
              size="small"
              variant="outlined"
              color="secondary"
              className="story-card-tags-item"
              label={profileInfo.language.value.toUpperCase()}
            />
          )}
          {props.story.storyParams.createdByAdmin ? (
            <Chip
              size="small"
              variant="outlined"
              label="Original"
              color="primary"
              className="story-card-tags-item"
            />
          ) : (
            props.story.createdAt && (
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                className="story-card-tags-item"
                label={new Date(props.story.createdAt).toLocaleString("en-GB", {
                  dateStyle: "short",
                })}
              />
            )
          )}
          {(profileInfo.gender === ChildGenderEnum.Girl ||
            profileInfo.gender === AdultGenderEnum.Female) && (
            <FemaleOutlined sx={{ fontSize: 18, color: "primary.main" }} />
          )}
          {(profileInfo.gender === ChildGenderEnum.Boy ||
            profileInfo.gender === AdultGenderEnum.Male) && (
            <MaleOutlined sx={{ fontSize: 18, color: "primary.main" }} />
          )}
        </div>

        {authorProfile &&
          (isDesktop ? (
            <UserAccountMenuButton user={authorProfile} />
          ) : (
            <Avatar
              variant="square"
              alt="User Picture"
              src={authorProfile.picture}
            />
          ))}
      </div>
    </Box>
  );
};

export default StoryCard;
