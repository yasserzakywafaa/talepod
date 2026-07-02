import "./ViewStory.scss";

import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import APP_CONSTANTS from "src/application/shared/app_constants";
import Box from "@mui/material/Box";
import ComicReader from "./features/ComicReader";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import LongStoryBody from "./features/LongStoryBody";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Share from "../../components/shared/Share/Share";
import { ShareFloating } from "src/components/shared/Share/ShareFloating";
import { Story } from "src/components/StoryCreator/store/state";
import StoryAudio from "./features/StoryAudio";
import StoryExportActions from "./features/StoryExportActions";
import StoryNotFound from "./features/StoryNotFound";
import ViewStoryAuthorInfo from "./features/ViewStoryAuthorInfo";
import ViewStoryInfo from "./features/ViewStoryInfo";
import ViewStorySEO from "./features/ViewStorySEO";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { buildStoryMetaDescription } from "src/shared/utils/storyMetaDescription";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useViewStoryContext } from "./store/Provider";
import { trackEvent } from "src/shared/utils/ga4";

const ViewStoryPage: React.FC = () => {
  const { slug } = useParams<{ userId: string; slug: string }>();
  const {
    store: {
      state: { isFetching, isCreatingAudio, story, storyAuthor },
      updateStoryAuthor,
    },
    manager: { setUp },
  } = useViewStoryContext();

  const {
    store: {
      state: { auth },
    },
    manager: { handleFetchUserById },
  } = useApplicationContext();

  const hasDirectionRtl = story && story.profileInfo.language.value === "ar";
  const isComic = !!story && story.format === "comic" && !!story.pages?.length;
  const trackedStorySlugRef = useRef<string | null>(null);

  const handleFetchStoryAuthorInfo = async () => {
    try {
      const fetchedStoryAuthorInfo = await handleFetchUserById(story.author);
      updateStoryAuthor(fetchedStoryAuthorInfo ?? undefined);
    } catch (error) {
      getAxiosError(error);
    }
  };

  const handleUpdateMetaTags = (story: Story) => {
    const description = buildStoryMetaDescription(story);

    const metaTag = document
      .getElementsByTagName("meta")
      .namedItem("description");
    metaTag?.setAttribute("content", description);

    const ogTitleMetaTag = document.getElementById("og-title");
    const ogDescriptionMetaTag = document.getElementById("og-description");
    ogTitleMetaTag?.setAttribute("content", story.title);
    ogDescriptionMetaTag?.setAttribute("content", description);

    const twitterTitleMetaTag = document.getElementById("twitter-title");
    const twitterDescriptionMetaTag = document.getElementById(
      "twitter-description",
    );
    twitterTitleMetaTag?.setAttribute("content", story.title);
    twitterDescriptionMetaTag?.setAttribute("content", description);
  };

  useEffect(() => {
    if (slug) {
      trackedStorySlugRef.current = null;
      setUp(slug);
    }
  }, [slug]);

  useEffect(() => {
    // If Current User is the author of this story, get User Info
    if (!story.storyParams.createdByAdmin && auth.user) {
      updateStoryAuthor(auth.user);
    }
  }, [auth]);

  useEffect(() => {
    if (story && story._id) {
      handleUpdateMetaTags(story);
    }
  }, [
    story?._id,
    story?.slug,
    story?.title,
    story?.summary,
    story?.mainStory,
    story?.profileInfo?.name,
    story?.storyParams?.environment?.name,
  ]);

  useEffect(() => {
    if (story && story._id && story.slug !== trackedStorySlugRef.current) {
      trackedStorySlugRef.current = story.slug;
      trackEvent("story_view", {
        story_slug: story.slug,
        story_format: story.format,
        has_audio: Boolean(story.audioFile?.url),
        is_comic: story.format === "comic",
      });

      const isStoryGenerated =
        window.localStorage.getItem(
          APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
        ) === "true";
      if (isStoryGenerated) {
        Notify({
          type: ToastTypes.Success,
          content: "Story created successfully.",
        });
        window.localStorage.removeItem(
          APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
        );
      }

      // Get story author Info
      if (!!story.author && !story.storyParams.createdByAdmin) {
        handleFetchStoryAuthorInfo();
      }
    }
  }, [story]);

  return (
    <Page
      isLoading={isFetching || isCreatingAudio}
      // isLoading={!isCreatingAudio}
      className="view-story-page"
      title={`${story && story.title} | Bedtime story on TalePod`}
      loaderComponentName={
        isCreatingAudio
          ? LoaderComponentNameEnum.CreateAudio
          : LoaderComponentNameEnum.BedtimeStory
      }
    >
      <Container
        className="view-story-container"
        sx={{
          pt: { xs: 1 },
          pb: 4,
        }}
      >
        {!isFetching && !story && <StoryNotFound />}

        {story && (
          <>
            <ShareFloating />

            {story.imagesStatus === "pending" && (
              <Alert
                severity="info"
                icon={<CircularProgress color="primary" size={20} />}
                variant="outlined"
                sx={{
                  mb: 1,
                  borderRadius: "var(--r-lg)",
                  alignItems: "center",
                }}
              >
                Story images are on the way
              </Alert>
            )}

            <Card
              className="view-story-card"
              vocab="https://schema.org"
              typeof="ShortStory"
            >
              <Box component="div" className="bg-image-character">
                <RandomImage />
              </Box>

              <CardContent className="view-story-card-content">
                {!isComic && story.coverImageUrl ? (
                  <Box className="view-story-hero" sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                        borderRadius: "var(--r-xl)",
                        boxShadow: "var(--shadow-md)",
                        mb: 2,
                      }}
                    >
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h1"
                      color="primary"
                      property="name"
                      className={`view-story-card-title ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                      sx={{ fontSize: { xs: "2rem", sm: "2.25rem" } }}
                    >
                      {story.title}
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      className={`view-story-card-summary ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                      sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                    >
                      {story.summary}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h1"
                      color="primary"
                      property="name"
                      className={`view-story-card-title ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                      sx={{ fontSize: { xs: "2rem", sm: "2.25rem" } }}
                    >
                      {story.title}
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      className={`view-story-card-summary ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                      sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                    >
                      {story.summary}
                    </Typography>
                  </>
                )}

                {isComic ? (
                  <>
                    <ComicReader story={story} />

                    <StoryAudio />
                  </>
                ) : (
                  <>
                    <StoryAudio />

                    <Box
                      component="article"
                      className={`view-story-card-main-story ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                    >
                      <LongStoryBody
                        mainStory={story.mainStory}
                        longStoryImages={story.longStoryImages}
                        className={
                          hasDirectionRtl ? "direction-rtl" : undefined
                        }
                      />
                    </Box>

                    <pre
                      className={`italics view-story-card-poem ${
                        hasDirectionRtl ? "direction-rtl" : ""
                      }`}
                    >
                      {story.poem}
                    </pre>
                  </>
                )}

                <StoryExportActions
                  story={story}
                  canEmail={!!auth.user?.email}
                />

                <ViewStoryInfo story={story} />

                {story.author && (
                  <ViewStoryAuthorInfo
                    story={story}
                    storyAuthor={storyAuthor}
                    handleUpdateStoryAuthor={updateStoryAuthor}
                  />
                )}

                <Share story={story} />
              </CardContent>
            </Card>

            <ViewStorySEO story={story} />
          </>
        )}
      </Container>
    </Page>
  );
};

export default ViewStoryPage;
