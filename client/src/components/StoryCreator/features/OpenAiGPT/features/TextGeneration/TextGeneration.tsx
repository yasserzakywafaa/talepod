import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent } from "react";

import { AutoAwesome } from "@mui/icons-material";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import ReactMarkdown from "react-markdown";
import TextToSpeechGeneration from "../TextToSpeechGeneration/TextToSpeechGeneration";
import { useOpenAiGPTContext } from "../../store/Provider";

const OpenAiGPTTextGeneration = () => {
  const { store, manager } = useOpenAiGPTContext();
  const { textGeneration } = store.state;
  const { isFetching, userPrompt, autoTextPrompt, generatedStory } =
    textGeneration;
  const {
    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleGenerateTextRequest,
  } = manager;

  const handleOnTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleUpdateUserTextPrompt(event.target.value);
  };

  const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userPrompt || autoTextPrompt) {
      handleIsTextGenFetching(true);
      handleGenerateTextRequest(userPrompt || autoTextPrompt);
    }
  };

  return (
    <Box position="relative" sx={{ marginY: "1rem" }}>
      {isFetching && <LoaderSpinner style={{ position: "absolute" }} />}

      <Box
        noValidate
        display="flex"
        component="form"
        autoComplete="off"
        position="relative"
        flexDirection="column"
        onSubmit={handleOnFormSubmit}
      >
        <Stack spacing={2} flexGrow={1}>
          <TextField
            multiline
            label="User Prompt"
            variant="outlined"
            value={userPrompt || autoTextPrompt}
            onChange={handleOnTextChange}
          />
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AutoAwesome />}
          >
            Generate
          </Button>
        </Stack>
      </Box>

      {generatedStory && generatedStory.mainStory && (
        <>
          <Divider style={{ margin: "2rem 0" }}>
            <Chip label="Answer" size="small" />
          </Divider>
          <Card sx={{ minWidth: 275 }}>
            <CardContent
              style={{
                color: generatedStory.statusCode !== 200 ? "red" : "unset",
              }}
            >
              <Typography variant="h5" component="div">
                {generatedStory.title}
              </Typography>

              <ReactMarkdown>
                {generatedStory.mainStory as string}
              </ReactMarkdown>
            </CardContent>

            <CardContent>
              <TextToSpeechGeneration />
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default OpenAiGPTTextGeneration;
