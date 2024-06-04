import "./StoryCreator.scss";

import { Box, Container, Tab, Tabs, Typography } from "@mui/material";

import GenerationOptionsForm from "./features/GenerationOptionsForm";
import GoogleGemini from "./features/GoogleGemini/GoogleGemini";
import OpenAiGPT from "./features/OpenAiGPT/OpenAiGPT";
import { useState } from "react";

export const StoryCreatorContent = () => {
  const [value, setValue] = useState(0);

  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container id="story-creator" sx={{ pt: { xs: 4, sm: 4 }, paddingX: 0 }}>
      <GenerationOptionsForm />

      <Box
        width="100%"
        display="flex"
        component="div"
        paddingX="1rem"
        flexDirection="row"
        justifyContent="space-around"
        className="ai-story-creator-wrapper"
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleTabsChange}
              aria-label="basic tabs example"
            >
              <Tab label="OpenAi" />
              <Tab label="Google Gemini" />
            </Tabs>
          </Box>

          <div
            role="tabpanel"
            hidden={value !== 0}
            id={`simple-tabpanel-${0}`}
            aria-labelledby={`simple-tab-${0}`}
          >
            {value === 0 && (
              <Box sx={{ p: 3 }}>
                <OpenAiGPT />
              </Box>
            )}
          </div>

          <div
            role="tabpanel"
            hidden={value !== 1}
            id={`simple-tabpanel-${1}`}
            aria-labelledby={`simple-tab-${1}`}
          >
            {value === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h4">Google Gemini</Typography>
                <GoogleGemini />
              </Box>
            )}
          </div>
        </Box>
      </Box>
    </Container>
  );
};
