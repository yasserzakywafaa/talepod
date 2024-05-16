import { Box, Typography } from "@mui/material";

// import ImageGeneration from "./features/ImageGeneration/ImageGeneration";
import TextGeneration from "./features/TextGeneration/TextGeneration";
import TextToSpeechGeneration from "./features/TextToSpeechGeneration/TextToSpeechGeneration";

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

        <TextGeneration />
      </Box>

      <Box className="openai-text-t-speech-generation" marginTop="1rem">
        <Typography variant="h4">Openai Chat-GPT TTS Generation</Typography>

        <TextToSpeechGeneration />
      </Box>

      {/* <Box className="openai-text-generation" marginTop="1rem">
        <Typography variant="h4">Openai Chat-GPT Image Generation</Typography>

        <ImageGeneration />
      </Box> */}
    </Box>
  );
};

export default OpenAiGPTContent;
