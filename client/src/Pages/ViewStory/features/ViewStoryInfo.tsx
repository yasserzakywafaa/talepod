import { Box, Card, CardContent, Chip } from "@mui/material";

import { ArtStyles } from "src/shared/artStyles";
import { Story } from "src/components/StoryCreator/store/state";

interface ViewStoryInfoParams {
  story: Story;
}

const artStyleLabel = (id?: string): string =>
  ArtStyles.find((style) => style.id === id)?.label ?? id ?? "";

const formatLabel = (format?: string): string =>
  format === "comic" ? "Comic" : format === "long" ? "Long Story" : "";

const ViewStoryInfo = (props: ViewStoryInfoParams) => {
  const { story } = props;

  const renderChipLabel = (key: string, value: string) => {
    return (
      <span>
        {key}: {""}
        <span className="bold">{value}</span>
      </span>
    );
  };

  return (
    <Card className="view-story-card-footer-info">
      <CardContent>
        {!props.story.storyParams.createdByAdmin && (
          <Chip
            variant="outlined"
            label={renderChipLabel(
              "Story created on",
              new Date(story.createdAt).toLocaleString("en-GB", {
                timeStyle: "short",
                dateStyle: "short",
              })
            )}
            color="primary"
          />
        )}

        <Box className="view-story-card-footer-info-tags">
          <Box className="view-story-card-footer-info-tags-profile-info">
            <Chip
              color="primary"
              variant="outlined"
              label={renderChipLabel("Name", story.profileInfo.name)}
              className="view-story-card-footer-info-tag"
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel("Gender", story.profileInfo.gender)}
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel(
                "Age",
                `${story.profileInfo.age}-years-old`
              )}
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel(
                "Language",
                story.profileInfo.language.name
              )}
            />

            {story.profileInfo.interests && (
              <Chip
                color="primary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  "Interests",
                  story.profileInfo.interests
                )}
              />
            )}
          </Box>

          <Box className="view-story-card-footer-info-tags-story-params">
            {story.storyParams.environment.value && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  "Environment",
                  story.storyParams.environment.name
                )}
              />
            )}

            {story.storyParams.moral.value && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel("Moral", story.storyParams.moral.name)}
              />
            )}

            {story.storyParams.tone.value && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel("Tone", story.storyParams.tone.name)}
              />
            )}

            {story.mainStory && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  "Story Length",
                  `${
                    story.storyParams.totalWords ??
                    story.mainStory.trim().split(/\s+/).filter(Boolean).length
                  } words`
                )}
              />
            )}

            {story.format && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel("Format", formatLabel(story.format))}
              />
            )}

            {story.artStyle && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  "Art Style",
                  artStyleLabel(story.artStyle)
                )}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewStoryInfo;
