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

import { AndroidRounded } from "@mui/icons-material";
import LoaderSpinner from "src/components/Loading/LoaderSpinner";
import { useOpenAiGPTContext } from "./domain/Provider";

const OpenAiGPTContent = () => {
  const { store, manager } = useOpenAiGPTContext();
  const { isFetching, userPrompt, optionsAutoPrompt, aiAnswer } = store.state;
  const { handleIsFetching, handleUpdateUserPrompt, handleGenerateRequest } =
    manager;

  const handleOnTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("handleOnTextChange:>>>", {
      value: event.target.value,
    });
    handleUpdateUserPrompt(event.target.value);
  };

  const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userPrompt || optionsAutoPrompt) {
      handleIsFetching(true);
      handleGenerateRequest(userPrompt || optionsAutoPrompt);
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
            value={userPrompt || optionsAutoPrompt}
            onChange={handleOnTextChange}
          />
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AndroidRounded />}
          >
            Ask chatGPT
          </Button>
        </Stack>
      </Box>

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
              <Typography variant="h5" component="div">
                {aiAnswer.title}
              </Typography>

              <Typography variant="h6" component="div">
                {aiAnswer.description}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default OpenAiGPTContent;
