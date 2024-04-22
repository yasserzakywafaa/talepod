import { Box, Divider, Typography } from "@mui/material";
import TextGeneration from "./features/TextGeneration/TextGeneration";
import ImageGeneration from "./features/ImageGeneration/ImageGeneration";

const OpenAiGPTContent = () => {
  return (
    <Box position="relative" sx={{ marginY: "1rem" }}>
      <Box
        display="flex"
        component="div"
        flexDirection="column"
        className="openai-wrapper"
        justifyContent="space-around"
      >
        <Box className="openai-text-generation">
          <Typography variant="h4">Openai Chat-GPT Text Generation</Typography>

          <TextGeneration />
        </Box>

        <Divider sx={{ marginY: 5 }} />

        <Box className="openai-text-generation">
          <Typography variant="h4">Openai Chat-GPT Image Generation</Typography>

          <ImageGeneration />
        </Box>
      </Box>
    </Box>
  );
};

export default OpenAiGPTContent;
