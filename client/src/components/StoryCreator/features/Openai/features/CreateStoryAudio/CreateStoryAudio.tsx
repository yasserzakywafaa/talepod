import { Box, Button, Paper, Stack } from "@mui/material";

import { AudioPlayer } from "src/components/shared/AudioPlayer/AudioPlayer";
import { AutoAwesome } from "@mui/icons-material";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { Story } from "src/components/StoryCreator/store/state";
import { useOpenaiContext } from "../../store/Provider";

const OpenAiGPTTextToSpeechGeneration = () => {
  const { store, manager } = useOpenaiContext();
  const { createStory: textGeneration, createAudio: textToSpeechGeneration } =
    store.state;
  const {
    isCreateAudioFetching: handleIsTextToSpeechGenFetching,
    handleCreateAudio: handleGenerateTextToSpeechRequest,
  } = manager;

  const handleOnGenerateTextToSpeechClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    if (textGeneration.story) {
      handleIsTextToSpeechGenFetching(true);
      handleGenerateTextToSpeechRequest(textGeneration.story as Story);
    }
  };

  return (
    <Box position="relative" sx={{ marginY: "1rem" }}>
      {textToSpeechGeneration.isFetching && (
        <LoaderSpinner style={{ position: "absolute" }} />
      )}

      <Stack spacing={2} flexGrow={1}>
        <Button
          type="submit"
          title="submit-button"
          variant="contained"
          endIcon={<AutoAwesome />}
          disabled={!textGeneration.story?.mainStory}
          onClick={handleOnGenerateTextToSpeechClick}
        >
          Create Audio
        </Button>
      </Stack>

      {textToSpeechGeneration.story &&
        textToSpeechGeneration.story.mainStory && (
          <>
            <Paper elevation={2} style={{ padding: "1rem" }}>
              <AudioPlayer
                url={textToSpeechGeneration.story.mainStory as string}
                name={textToSpeechGeneration.story.title!}
              />
            </Paper>
          </>
        )}
    </Box>
  );
};

export default OpenAiGPTTextToSpeechGeneration;
