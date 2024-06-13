import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent } from "react";

import { AndroidRounded } from "@mui/icons-material";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useOpenAiGPTContext } from "../../store/Provider";

const OpenAiGPTImageGeneration = () => {
  const { store, manager } = useOpenAiGPTContext();
  const { imageGeneration } = store.state;
  const { isFetching, userPrompt, autoImagePrompt, generatedImage } =
    imageGeneration;
  const {
    handleIsImageGenFetching,
    handleUpdateUserImagePrompt,
    handleGenerateImageRequest,
  } = manager;

  const handleOnTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("handleOnTextChange:>>>", {
      value: event.target.value,
    });
    handleUpdateUserImagePrompt(event.target.value);
  };

  const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (userPrompt || autoImagePrompt) {
      handleIsImageGenFetching(true);
      handleGenerateImageRequest(userPrompt || autoImagePrompt);
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
            value={userPrompt || autoImagePrompt || undefined}
            onChange={handleOnTextChange}
          />
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AndroidRounded />}
          >
            Generate Image
          </Button>
        </Stack>
      </Box>

      {generatedImage && generatedImage.content && (
        <>
          <Divider style={{ margin: "2rem 0" }}>
            <Chip label="Answer" size="small" />
          </Divider>
          <Card sx={{ minWidth: 275 }}>
            <CardContent
              style={{
                color: generatedImage.statusCode !== 200 ? "red" : "unset",
              }}
            >
              {generatedImage.statusCode !== 200 && (
                <>
                  <Typography variant="h5" component="div">
                    {generatedImage.title}
                  </Typography>

                  <Typography variant="h6" component="div">
                    {generatedImage.content}
                  </Typography>
                </>
              )}

              <ImageList variant="standard" cols={2} gap={20}>
                {typeof generatedImage.content !== "string" &&
                  generatedImage.content.length &&
                  generatedImage.content.map((image, index) => (
                    <Card variant="outlined">
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          width="100%"
                          loading="lazy"
                          alt="Generated with Openai DALL-E"
                        />
                      </ImageListItem>
                    </Card>
                  ))}
              </ImageList>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default OpenAiGPTImageGeneration;
