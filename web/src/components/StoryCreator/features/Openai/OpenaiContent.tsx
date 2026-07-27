import { Box } from "@mui/material";
import CreateStory from "./features/CreateStory/CreateStory";

const OpenaiContent = () => {
  return (
    <Box
      component="div"
      className="openai-wrapper"
      sx={{
        paddingY: "1rem",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "space-around"
      }}>
      <Box className="openai-text-generation" sx={{
        marginBottom: "1rem"
      }}>
        {/* <Typography variant="h4">Openai Chat-GPT Text Generation</Typography> */}
        <CreateStory />
      </Box>
      {/* <Box className="openai-text-generation" marginTop="1rem">
        <Typography variant="h4">Openai Chat-GPT Image Generation</Typography>

        <CreateStoryImages />
      </Box> */}
    </Box>
  );
};

export default OpenaiContent;
