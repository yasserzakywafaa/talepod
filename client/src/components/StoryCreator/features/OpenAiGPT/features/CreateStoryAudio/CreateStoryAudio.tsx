import { Box, Button, Paper, Stack } from "@mui/material";

import { AudioPlayer } from "src/components/shared/AudioPlayer/AudioPlayer";
import { AutoAwesome } from "@mui/icons-material";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useOpenAiGPTContext } from "../../store/Provider";

const OpenAiGPTTextToSpeechGeneration = () => {
  const { store, manager } = useOpenAiGPTContext();
  const { textGeneration, textToSpeechGeneration } = store.state;
  const { handleIsTextToSpeechGenFetching, handleGenerateTextToSpeechRequest } =
    manager;

  const handleOnGenerateTextToSpeechClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    if (textGeneration.generatedStory) {
      handleIsTextToSpeechGenFetching(true);
      handleGenerateTextToSpeechRequest(
        textGeneration.generatedStory.mainStory as string
      );
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
          disabled={!textGeneration.generatedStory?.mainStory}
          onClick={handleOnGenerateTextToSpeechClick}
        >
          Create Audio
        </Button>
      </Stack>

      {textToSpeechGeneration.generatedStory &&
        textToSpeechGeneration.generatedStory.mainStory && (
          <>
            <Paper elevation={2} style={{ padding: "1rem" }}>
              <AudioPlayer
                url={textToSpeechGeneration.generatedStory.mainStory as string}
                name={textToSpeechGeneration.generatedStory.title!}
              />
            </Paper>
          </>
        )}
    </Box>
  );
};

export default OpenAiGPTTextToSpeechGeneration;
