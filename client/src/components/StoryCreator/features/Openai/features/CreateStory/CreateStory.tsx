import {
  Box,
  // Button,
  // Card,
  // CardContent,
  // Chip,
  // Divider,
  Stack,
  TextField,
  // Typography,
} from "@mui/material";

// import { AutoAwesome } from "@mui/icons-material";
// import { FormEvent } from "react";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
// import ReactMarkdown from "react-markdown";
// import TextToSpeechGeneration from "../CreateStoryAudio/CreateStoryAudio";
import { useOpenaiContext } from "../../store/Provider";

const CreateStory = () => {
  const { store, manager } = useOpenaiContext();
  const { createStory } = store.state;
  const { isFetching, createStoryPrompt } = createStory;
  const {
    // isCreateStoryFetching,
    // handleCreateStoryRequest,
  } = manager;

  // const handleOnFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   if (createStoryPrompt) {
  //     isCreateStoryFetching(true);
  //     // handleGenerateTextRequest(createStoryPrompt, profileInfo);
  //   }
  // };

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
        // onSubmit={handleOnFormSubmit}
      >
        <Stack spacing={2} flexGrow={1}>
          <TextField
            multiline
            label="Create Story Prompt"
            variant="outlined"
            value={createStoryPrompt}
            // onChange={...}
          />
          {/* <Button
            type="submit"
            title="submit-button"
            variant="contained"
            endIcon={<AutoAwesome />}
          >
            Create
          </Button> */}
        </Stack>
      </Box>

      {/* {story && story.mainStory && (
        <>
          <Divider style={{ margin: "2rem 0" }}>
            <Chip label="Answer" size="small" />
          </Divider>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {story.title}
              </Typography>

              <ReactMarkdown>{story.mainStory as string}</ReactMarkdown>
            </CardContent>

            <CardContent>
              <TextToSpeechGeneration />
            </CardContent>
          </Card>
        </>
      )} */}
    </Box>
  );
};

export default CreateStory;
