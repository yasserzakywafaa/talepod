import { Box, Card, Typography } from "@mui/material";
import { useStoryCreatorContext } from "./domain/Provider";
import GoogleGemini from "./features/GoogleGemini/GoogleGemini";
import OpenAiGPT from "./features/OpenAiGPT/OpenAiGPT";
import GenerationOptionsForm from "./features/OpenAiGPT/features/GenerationOptionsForm";

export const StoryCreatorContent = () => {
  const { store, manager } = useStoryCreatorContext();
  const { childInfo } = store.state;

  return (
    <>
      <GenerationOptionsForm
        childInfo={childInfo}
        handleUpdateChildInfo={manager.handleUpdateChildInfo}
      />

      <Box
        width="100%"
        display="flex"
        component="div"
        flexDirection="row"
        justifyContent="space-around"
        className="ai-story-creator-wrapper"
      >
        <Card sx={{ flexBasis: "50%", marginX: 1, padding: 2 }}>
          <Typography variant="h4">Google Gemini</Typography>
          <GoogleGemini />
        </Card>

        <Card sx={{ flexBasis: "100%", marginX: 1, padding: 2 }}>
          <OpenAiGPT />

          {/* <Box
            display="flex"
            component="div"
            flexDirection="column"
            className="openai-wrapper"
            justifyContent="space-around"
          >
            <Box className="openai-text-generation">
              <Typography variant="h4">
                Openai Chat-GPT Text Generation
              </Typography>
              <OpenAiGPT />
            </Box>

            <Divider sx={{ marginY: 5 }} />

            <Box className="openai-image-generation">
              <Typography variant="h4">
                Openai Chat-GPT Image Generation
              </Typography>
              <OpenAiGPT />
            </Box>
          </Box> */}
        </Card>
      </Box>
    </>
  );
};
