import "./ViewStory.scss";

import {
  AdultGenderEnum,
  Story,
  userAudioVoiceNames,
} from "src/components/StoryCreator/store/state";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import Box from "@mui/material/Box";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import { LyricsOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import ReactMarkdown from "react-markdown";
import Share from "../../components/shared/Share";
import StoryNotFound from "./features/StoryNotFound";
import { VerifiedBadge } from "src/components/shared/VerifiedBadge";
import ViewStoryAuthorInfo from "./features/ViewStoryAuthorInfo";
import ViewStoryInfo from "./features/ViewStoryInfo";
import ViewStorySEO from "./features/ViewStorySEO";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useEffect } from "react";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import { useParams } from "react-router-dom";
import { useViewStoryContext } from "./store/Provider";

const ViewStoryPage: React.FC = () => {
  const { userId, slug } = useParams<{ userId: string; slug: string }>();
  const { isDesktop } = useDeviceSize();

  const {
    store: {
      state: {
        isFetching,
        isCreatingAudio,
        story,
        storyAuthor,
        audioFileVoice,
      },
      updateStory,
      setIsCreatingAudio,
      updateStoryAuthor,
      updateAudioFileVoice,
    },
    manager: { setUp },
  } = useViewStoryContext();
  const {
    store: {
      state: { createAudio },
      updateState,
    },
    manager: { handleCreateAudio },
  } = useOpenaiContext();

  const {
    store: {
      state: { auth },
    },
    manager: { handleFetchUserInfo },
  } = useApplicationContext();

  const hasDirectionRtl = story && story.profileInfo.language.value === "ar";

  const dropdownOptionsFemale = userAudioVoiceNames.filter(
    (voice) => voice.gender === AdultGenderEnum.Female
  );
  const dropdownOptionsMale = userAudioVoiceNames.filter(
    (voice) => voice.gender === AdultGenderEnum.Male
  );

  const isReadOnlyMode = () => {
    if (
      auth.user &&
      auth.user._id !== userId &&
      !story.storyParams.createdByAdmin
    ) {
      return true;
    } else return false;
  };

  const handleOnCreateAudioClick = async () => {
    setIsCreatingAudio(true);
    if (story.mainStory) {
      try {
        const audioFile = await handleCreateAudio(story);
        if (audioFile && audioFile.url) {
          updateStory({
            ...story,
            audioFile,
          });
        }
      } catch (error) {
        Notify({
          type: ToastTypes.Error,
          content: `❌ Failed to create audio! ${error}`,
        });
      }
    }
    setIsCreatingAudio(false);
  };

  const handleFetchStoryAuthorInfo = async () => {
    try {
      const fetchedStoryAuthorInfo = await handleFetchUserInfo(story.author);
      updateStoryAuthor(fetchedStoryAuthorInfo);
    } catch (error) {
      getAxiosError(error);
    }
  };

  const handleOnAudioVoiceChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const currentVoice = userAudioVoiceNames.find(
      (voice) => voice.name === value
    );

    if (currentVoice) {
      updateAudioFileVoice(currentVoice);
      updateState("createAudio", {
        ...createAudio,
        audioFileVoice: currentVoice,
      });
    }
  };

  const handleUpdateMetaTags = (story: Story) => {
    // Update page meta tags
    const metaTag = document
      .getElementsByTagName("meta")
      .namedItem("description");
    metaTag?.setAttribute(
      "content",
      `Discover more bedtime stories for children and families on TalePod | ${story.summary}`
    );

    // Update Open Graph meta tags
    const ogTitleMetaTag = document.getElementById("og-title");
    const ogDescriptionMetaTag = document.getElementById("og-description");
    ogTitleMetaTag?.setAttribute("content", story.title);
    ogDescriptionMetaTag?.setAttribute("content", story.summary);

    // Update Open Graph Twitter meta tags
    const twitterTitleMetaTag = document.getElementById("twitter-title");
    const twitterDescriptionMetaTag = document.getElementById(
      "twitter-description"
    );
    twitterTitleMetaTag?.setAttribute("content", story.title);
    twitterDescriptionMetaTag?.setAttribute("content", story.summary);
  };

  useEffect(() => {
    if (slug) setUp(slug);
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

      const newStoryCreated =
        window.localStorage.getItem("newStoryCreated") === "true";
      if (newStoryCreated) {
        Notify({
          type: ToastTypes.Success,
          content: "Story created successfully.",
        });
        window.localStorage.removeItem("newStoryCreated");
      }

      // If Current User is NOT the author of this story, get author Info
      if (
        !!story.author &&
        isReadOnlyMode() &&
        !story.storyParams.createdByAdmin
      ) {
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
            <Card
              className="view-story-card"
              vocab="https://schema.org"
              typeof="ShortStory"
            >
              <Box component="div" className="bg-image-character">
                <RandomImage />
              </Box>
              <CardContent className="view-story-card-content">
                {/* {isReadOnlyMode() && (
                  <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                    {"Shared by: Yasser"}
                  </Alert>
                )} */}

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

                <Card
                  className="view-story-card-story-wrapper"
                  sx={{
                    textAlign: "center",
                    mt: 1,
                    mb: 2,
                    py: !isReadOnlyMode() ? 1 : 0,
                    px: 1,
                  }}
                >
                  {!isReadOnlyMode() && !story.audioFile && (
                    <>
                      <Typography
                        gutterBottom
                        component="h3"
                        sx={{
                          fontSize: "1.25rem",
                          color: (theme) => theme.palette.primary.main,
                        }}
                      >
                        Create audio for this story
                      </Typography>

                      <Box
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection={{ xs: "column", sm: "row" }}
                      >
                        <FormControl
                          sx={{
                            margin: "1rem",
                            width: { xs: "50%", sm: "15%" },
                          }}
                          className="voice-select-dropdown"
                        >
                          <InputLabel id="voice-select-label">Voice</InputLabel>
                          <Select
                            required
                            name="voice"
                            label="Voice"
                            id="voice-select"
                            variant="outlined"
                            labelId="voice-select-label"
                            value={audioFileVoice.name}
                            defaultValue={audioFileVoice.name}
                            onChange={handleOnAudioVoiceChange}
                          >
                            <ListSubheader>Female</ListSubheader>
                            {dropdownOptionsFemale.map((voice, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={voice.name}
                                  disabled={
                                    !voice.isFree && !auth.user?.isPaidUser
                                  }
                                >
                                  <Typography
                                    component="span"
                                    sx={{ marginRight: 0.5 }}
                                  >
                                    {voice.value}
                                  </Typography>
                                  {!voice.isFree && !auth.user?.isPaidUser && (
                                    <VerifiedBadge />
                                  )}
                                </MenuItem>
                              );
                            })}

                            <ListSubheader>Male</ListSubheader>
                            {dropdownOptionsMale.map((voice, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={voice.name}
                                  disabled={
                                    !voice.isFree && !auth.user?.isPaidUser
                                  }
                                >
                                  <Typography
                                    component="span"
                                    sx={{ marginRight: 0.5 }}
                                  >
                                    {voice.value}
                                  </Typography>
                                  {!voice.isFree && !auth.user?.isPaidUser && (
                                    <VerifiedBadge />
                                  )}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>

                        <Button
                          size="large"
                          type="button"
                          variant="contained"
                          endIcon={<LyricsOutlined />}
                          onClick={handleOnCreateAudioClick}
                        >
                          Create Audio
                        </Button>
                      </Box>
                    </>
                  )}

                  {story.audioFile && (
                    <Box mt={2}>
                      <Typography
                        variant="h6"
                        component="h6"
                        gutterBottom
                        sx={{ color: (theme) => theme.palette.primary.main }}
                      >
                        Listen to the Story
                      </Typography>

                      <CardMedia
                        component="audio"
                        controls
                        src={story.audioFile.url}
                      />

                      <Chip
                        sx={{ mt: 2, mb: 1 }}
                        variant="outlined"
                        label={
                          <span color="textSecondary">
                            Audio created on:{" "}
                            <span className="bold">
                              {new Date(
                                story.audioFile.createdAt
                              ).toLocaleString("en-GB", {
                                timeStyle: "short",
                                dateStyle: "short",
                              })}
                            </span>
                          </span>
                        }
                        color="primary"
                      />
                    </Box>
                  )}
                </Card>
                {isDesktop ? (
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    Story
                  </Typography>
                ) : (
                  <></>
                )}

                <Box
                  component="article"
                  className={`view-story-card-main-story ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                >
                  <ReactMarkdown>{story.mainStory}</ReactMarkdown>
                </Box>

                <pre
                  className={`italics view-story-card-poem ${
                    hasDirectionRtl ? "direction-rtl" : ""
                  }`}
                >
                  {story.poem}
                </pre>

                {story.author &&
                  !story.storyParams.createdByAdmin &&
                  storyAuthor && (
                    <ViewStoryAuthorInfo
                      story={story}
                      storyAuthor={storyAuthor}
                      handleUpdateStoryAuthor={updateStoryAuthor}
                    />
                  )}

                <ViewStoryInfo story={story} />

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
