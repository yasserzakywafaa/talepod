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

import { AndroidRounded } from "@mui/icons-material";
import { FormEvent } from "react";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import { useOpenaiContext } from "../../store/Provider";

const OpenAiGPTImageGeneration = () => {
  const { store, manager } = useOpenaiContext();
  const { createImage } = store.state;
  const { isFetching, createImagePrompt, image } = createImage;
  const { isCreateImageFetching, handleCreateImage } = manager;

  const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (createImagePrompt) {
      isCreateImageFetching(true);
      handleCreateImage(createImagePrompt);
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
            value={createImagePrompt || undefined}
            // onChange={...}
          />
          <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AndroidRounded />}
          >
            Create Image
          </Button>
        </Stack>
      </Box>

      {image && image.content && (
        <>
          <Divider style={{ margin: "2rem 0" }}>
            <Chip label="Answer" size="small" />
          </Divider>
          <Card sx={{ minWidth: 275 }}>
            <CardContent
              style={{
                color: image.statusCode !== 200 ? "red" : "unset",
              }}
            >
              {image.statusCode !== 200 && (
                <>
                  <Typography variant="h5" component="div">
                    {image.title}
                  </Typography>

                  <Typography variant="h6" component="div">
                    {image.content}
                  </Typography>
                </>
              )}

              <ImageList variant="standard" cols={2} gap={20}>
                {typeof image.content !== "string" &&
                  image.content.length &&
                  image.content.map((image, index) => (
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
