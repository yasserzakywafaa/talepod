import { Box, Card, CardContent, Chip } from "@mui/material";

import { Story } from "src/components/StoryCreator/store/state";

interface ViewStoryInfoParams {
  story: Story;
}

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

            {story.storyParams.totalCharacters && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  "Story Length",
                  `${story.storyParams.totalCharacters}`
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
