import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { Google } from "@mui/icons-material";
import { ChangeEvent, FormEvent, useState } from "react";

import END_POINTS from "src/lib/endpoints";
import LoaderSpinner from "src/components/Loading/LoaderSpinner";
import { Notify, ToastTypes } from "../Notification/Notification";

interface AiAnswerProps {
  title: string;
  statusCode: number;
  description: string;
}

const GoogleGeminiSection = () => {
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

    console.log("form is submitting:>>>", {
      userPrompt,
    });

    if (userPrompt) {
      setIsFetching(true);
      // handleGenerateContent(userPrompt);
      userPrompt && handleChat(userPrompt);
    }
  };

  // const handleGenerateContent = async (userPrompt: string) => {
  //   try {
  //     const URL = END_POINTS(userPrompt);
  //     const generateResponse = await axios.post(URL.GOOGLE_GEMINI.GENERATE);
  //     setAiAnswer({
  //       statusCode: 200,
  //       title: "",
  //       description: generateResponse.data,
  //     });

  //     setIsFetching(false);
  //   } catch (error) {
  //     console.log("request error:>>>", {
  //       error,
  //     });
  //     setAiAnswer({
  //       statusCode: error.response.status,
  //       title: error.response.statusText,
  //       description: error.response.data.message,
  //     });
  //     setIsFetching(false);
  //     Notify({
  //       content: `${error.response.status} ${error.response.statusText}\n${error.response.data.message}`,
  //       type: ToastTypes.Error,
  //     });
  //   }
  // };

  const handleChat = async (userPrompt: string) => {
    try {
      const URL = END_POINTS(userPrompt);
      const chatResponse = await axios.post(URL.GOOGLE_GEMINI.CHAT);
      setAiAnswer({
        statusCode: 200,
        title: "",
        description: chatResponse.data,
      });

      setIsFetching(false);
    } catch (error) {
      console.log("request error:>>>", {
        error,
      });

      if (axios.isAxiosError(error) && error.response) {
        setAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.data.message,
        });
        setIsFetching(false);
        Notify({
          content: `${error.response.status} ${error.response.statusText}\n${error.response.data.message}`,
          type: ToastTypes.Error,
        });
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
            endIcon={<Google />}
          >
            Ask Google Gemini
          </Button>
        </Stack>

        {aiAnswer.description && (
          <>
            <Divider style={{ margin: "2rem 0" }}>
              <Chip label="Answer" size="small" />
            </Divider>

            <Card sx={{ minWidth: 275 }}>
              <CardContent>
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

export default GoogleGeminiSection;
