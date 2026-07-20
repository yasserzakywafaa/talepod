import { Box, Card, CardContent, Chip } from "@mui/material";

import { ArtStyles } from "src/shared/artStyles";
import { Story } from "src/components/StoryCreator/store/state";
import { useTranslation } from "react-i18next";

interface ViewStoryInfoParams {
  story: Story;
}

const artStyleLabel = (id?: string): string =>
  ArtStyles.find((style) => style.id === id)?.label ?? id ?? "";

const ViewStoryInfo = (props: ViewStoryInfoParams) => {
  const { t } = useTranslation("story");
  const { story } = props;

  const formatLabel = (format?: string): string =>
    format === "comic"
      ? t("reader.meta.formatComic")
      : format === "long"
        ? t("reader.meta.formatLong")
        : "";

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
              t("reader.meta.createdOn"),
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
              label={renderChipLabel(
                t("reader.meta.name"),
                story.profileInfo.name,
              )}
              className="view-story-card-footer-info-tag"
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel(
                t("reader.meta.gender"),
                story.profileInfo.gender,
              )}
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel(
                t("reader.meta.age"),
                t("reader.meta.ageSuffix", { age: story.profileInfo.age }),
              )}
            />
            <Chip
              color="primary"
              variant="outlined"
              className="view-story-card-footer-info-tag"
              label={renderChipLabel(
                t("reader.meta.language"),
                story.profileInfo.language.name,
              )}
            />

            {story.profileInfo.interests && (
              <Chip
                color="primary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.interests"),
                  story.profileInfo.interests,
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
                  t("reader.meta.environment"),
                  story.storyParams.environment.name,
                )}
              />
            )}

            {story.storyParams.moral.value && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.moral"),
                  story.storyParams.moral.name,
                )}
              />
            )}

            {story.storyParams.tone.value && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.tone"),
                  story.storyParams.tone.name,
                )}
              />
            )}

            {story.mainStory && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.storyLength"),
                  t("reader.meta.wordCount", {
                    count:
                      story.storyParams.totalWords ??
                      story.mainStory.trim().split(/\s+/).filter(Boolean)
                        .length,
                  }),
                )}
              />
            )}

            {story.format && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.format"),
                  formatLabel(story.format),
                )}
              />
            )}

            {story.artStyle && (
              <Chip
                color="secondary"
                variant="outlined"
                className="view-story-card-footer-info-tag"
                label={renderChipLabel(
                  t("reader.meta.artStyle"),
                  artStyleLabel(story.artStyle),
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
