import { Box, Typography } from "@mui/material";

import CreateStory from "./features/CreateStory/CreateStory";

// import CreateStoryImages from "./features/CreateStoryImage/CreateStoryImage";

// import TextToSpeechGeneration from "./features/TextToSpeechGeneration/TextToSpeechGeneration";

const OpenAiGPTContent = () => {
  return (
    <Box
      paddingY="1rem"
      display="flex"
      component="div"
      flexDirection="column"
      position="relative"
      className="openai-wrapper"
      justifyContent="space-around"
    >
      <Box className="openai-text-generation" marginBottom="1rem">
        <Typography variant="h4">Openai Chat-GPT Text Generation</Typography>

        <CreateStory />
      </Box>

      {/* <Box className="openai-text-generation" marginTop="1rem">
        <Typography variant="h4">Openai Chat-GPT Image Generation</Typography>

        <CreateStoryImages />
      </Box> */}
    </Box>
  );
};

export default OpenAiGPTContent;
