import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import LoaderSpinner from "src/components/Loading/LoaderSpinner";
import END_POINTS from "src/lib/endpoints";
import { AndroidRounded } from "@mui/icons-material";

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

    console.log("form is submitting:>>>", {
      userPrompt,
    });

    setIsFetching(true);

    try {
      const URL = END_POINTS(userPrompt);
      const response = await axios.post(URL.OPENAI.USER_PROMPT);
      setIsFetching(false);
      setAiAnswer({
        statusCode: response.data,
        title: response.data,
        description: response.data,
      });
    } catch (error) {
      console.log("request error:>>>", {
        error,
      });
      setAiAnswer({
        statusCode: error.response.status,
        title: error.response.statusText,
        description: error.response.data,
      });
      setIsFetching(false);
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
                style={
                  aiAnswer.statusCode !== 200 && {
                    color: "red",
                  }
                }
              >
                <Typography variant="h5" component="div">
                  {aiAnswer.title}
                </Typography>

                <Typography variant="h6" component="div">
                  {aiAnswer.description}
                </Typography>
              </CardContent>

              {/* <CardActions>
              <Button size="small" variant="outlined">
                Ask another question?
              </Button>
            </CardActions> */}
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OpenAISection;
