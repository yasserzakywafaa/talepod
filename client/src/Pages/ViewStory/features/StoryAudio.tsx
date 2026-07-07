import {
  Box,
  Button,
  Card,
  Chip,
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
import {
  AdultGenderEnum,
  userAudioVoiceNames,
} from "src/components/StoryCreator/store/state";

import { FC } from "react";
import { LyricsOutlined } from "@mui/icons-material";
import { AudioPlayer } from "src/components/shared/AudioPlayer/AudioPlayer";
import { VerifiedBadge } from "src/components/shared/VerifiedBadge";
import { useApplicationContext } from "src/application/store/Provider";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import { useParams } from "react-router-dom";
import { useViewStoryContext } from "../store/Provider";

/**
 * Audio creation + playback for a story (long or comic). Self-contained: reads
 * the story + selected voice from the ViewStory context and drives TTS via the
 * OpenAI context. Comics narrate their page captions (handled in
 * useCreateStoryAudio). `setIsCreatingAudio` still feeds the page-level loader
 * in ViewStory since both share the ViewStory store.
 */
const StoryAudio: FC = () => {
  const { userId } = useParams<{ userId: string; slug: string }>();

  const {
    store: {
      state: { story, audioFileVoice },
      updateStory,
      setIsCreatingAudio,
      updateAudioFileVoice,
    },
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
  } = useApplicationContext();

  if (!story?._id) return null;

  const isComic = story.format === "comic" && !!story.pages?.length;

  const dropdownOptionsFemale = userAudioVoiceNames.filter(
    (voice) => voice.gender === AdultGenderEnum.Female
  );
  const dropdownOptionsMale = userAudioVoiceNames.filter(
    (voice) => voice.gender === AdultGenderEnum.Male
  );

  const isReadOnlyMode = () => {
    if (!userId && auth.user?._id === story.author) return false;
    if (!userId && !story.storyParams.createdByAdmin) return true;
    if (auth.user?._id !== userId && !story.storyParams.createdByAdmin) {
      return true;
    }
    return false;
  };

  const handleOnCreateAudioClick = async () => {
    setIsCreatingAudio(true);
    const hasNarratableText =
      !!story.mainStory || (isComic && !!story.pages?.length);
    if (hasNarratableText) {
      try {
        const audioFile = await handleCreateAudio(story);
        if (audioFile && audioFile.url) {
          updateStory({ ...story, audioFile });
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

  return (
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
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" }
            }}>
            <FormControl
              sx={{ margin: "1rem", width: { xs: "50%", sm: "15%" } }}
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
                {dropdownOptionsFemale.map((voice, index) => (
                  <MenuItem
                    key={index}
                    value={voice.name}
                    disabled={!voice.isFree && !auth.user?.isPaidUser}
                  >
                    <Typography component="span" sx={{ marginRight: 0.5 }}>
                      {voice.value}
                    </Typography>
                    {!voice.isFree && !auth.user?.isPaidUser && <VerifiedBadge />}
                  </MenuItem>
                ))}

                <ListSubheader>Male</ListSubheader>
                {dropdownOptionsMale.map((voice, index) => (
                  <MenuItem
                    key={index}
                    value={voice.name}
                    disabled={!voice.isFree && !auth.user?.isPaidUser}
                  >
                    <Typography component="span" sx={{ marginRight: 0.5 }}>
                      {voice.value}
                    </Typography>
                    {!voice.isFree && !auth.user?.isPaidUser && <VerifiedBadge />}
                  </MenuItem>
                ))}
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
        <Box sx={{
          mt: 2
        }}>
          <Typography
            variant="h6"
            component="h6"
            gutterBottom
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            Listen to the Story
          </Typography>

          <AudioPlayer
            url={story.audioFile.url}
            title={story.title}
            voiceLabel={audioFileVoice.value}
            coverImage={story.coverImageUrl || story.pages?.[0]?.imageUrl}
          />

          <Chip
            sx={{ mt: 2, mb: 1 }}
            variant="outlined"
            label={
              <span color="textSecondary">
                Audio created on:{" "}
                <span className="bold">
                  {new Date(story.audioFile.createdAt).toLocaleString("en-GB", {
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
  );
};

export default StoryAudio;
