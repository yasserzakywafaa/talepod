import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import { AndroidRounded } from "@mui/icons-material";
import { AudioPlayer } from "src/components/shared/AudioPlayer/AudioPlayer";
// import { FormEvent } from "react";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useOpenAiGPTContext } from "../../domain/Provider";

const OpenAiGPTTextToSpeechGeneration = () => {
  const { store, manager } = useOpenAiGPTContext();
  const { textGeneration, textToSpeechGeneration } = store.state;
  const { isFetching, aiAnswer } = textToSpeechGeneration;
  const { handleIsTextToSpeechGenFetching, handleGenerateTextToSpeechRequest } =
    manager;

  const handleOnGenerateTextToSpeechClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    console.log("handleOnGenerateTextToSpeechClick:>>> ", {
      textGeneration,
    });

    if (textGeneration.aiAnswer.description) {
      handleIsTextToSpeechGenFetching(true);
      handleGenerateTextToSpeechRequest(
        textGeneration.aiAnswer.description as string
      );
    }
  };

  return (
    <Box position="relative" sx={{ marginY: "1rem" }}>
      {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

      <Stack spacing={2} flexGrow={1}>
        <Button
          type="submit"
          title="submit-button"
          variant="contained"
          endIcon={<AndroidRounded />}
          disabled={!textGeneration.aiAnswer.description}
          onClick={handleOnGenerateTextToSpeechClick}
        >
          Generate Audio with chatGPT
        </Button>
      </Stack>

      {aiAnswer.description && (
        <>
          <Divider style={{ margin: "2rem 0" }}>
            <Chip label="Answer" size="small" />
          </Divider>
          <Card sx={{ minWidth: 275 }}>
            <CardContent
              style={{
                color: aiAnswer.statusCode !== 200 ? "red" : "unset",
              }}
            >
              <AudioPlayer audioUrl={aiAnswer.description as string} />
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default OpenAiGPTTextToSpeechGeneration;
