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
import { ChangeEvent, FormEvent, useState } from "react";
import { Notify, ToastTypes } from "../Notification/Notification";

import { AndroidRounded } from "@mui/icons-material";
import END_POINTS from "src/lib/endpoints";
import LoaderSpinner from "src/components/Loading/LoaderSpinner";
import axios from "axios";

interface AiAnswerProps {
  title: string;
  statusCode: number;
  description: string;
}

const OpenAISection = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string | undefined>("");
  const [aiAnswer, setAiAnswer] = useState<AiAnswerProps>({
    statusCode: 0,
    title: "",
    description: "",
  });

  const handleOnTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("handleOnTextChange:>>>", {
      value: event.target.value,
    });
    setUserPrompt(event.target.value);
  };

  const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userPrompt) {
      setIsFetching(true);

      try {
        const URL = END_POINTS(userPrompt);
        const response = await axios.post(URL.OPENAI.USER_PROMPT);

        console.log("OpenAiSection:>>>", {
          response,
        });

        setIsFetching(false);
        setAiAnswer({
          statusCode: response.status,
          title: "",
          description: response.data,
        });
      } catch (error) {
        console.error("OpenAiSection:>>> Error", {
          error,
        });
        setIsFetching(false);
        if (axios.isAxiosError(error) && error.response) {
          setAiAnswer({
            statusCode: error.response.status,
            title: error.response.statusText,
            description: error.response.statusText,
          });
          Notify({
            content: error.response.statusText,
            type: ToastTypes.Error,
          });
        } else {
          Notify({
            content: `Oops! Something went wrong.\n${error}`,
            type: ToastTypes.Error,
          });
        }
      }
    }
  };

  return (
    <Box position="relative" sx={{ padding: "1rem" }}>
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
            label="User Prompt"
            variant="outlined"
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
    </Box>
  );
};

export default OpenAISection;
