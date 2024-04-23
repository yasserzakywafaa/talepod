import { Box, Typography } from "@mui/material";
import TextGeneration from "./features/TextGeneration/TextGeneration";
import ImageGeneration from "./features/ImageGeneration/ImageGeneration";

const OpenAiGPTContent = () => {
  return (
    <Box
      paddingY="1rem"
      display="flex"
      component="div"
      flexDirection="row"
      position="relative"
      className="openai-wrapper"
      justifyContent="space-around"
    >
      <Box className="openai-text-generation">
        <Typography variant="h4">Openai Chat-GPT Text Generation</Typography>

        <TextGeneration />
      </Box>

      <Box className="openai-text-generation">
        <Typography variant="h4">Openai Chat-GPT Image Generation</Typography>

        <ImageGeneration />
      </Box>
    </Box>
  );
};

export default OpenAiGPTContent;
