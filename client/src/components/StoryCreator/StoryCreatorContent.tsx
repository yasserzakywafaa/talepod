import { Box, Tab, Tabs, Typography } from "@mui/material";

import GenerationOptionsForm from "./features/GenerationOptionsForm";
import GoogleGemini from "./features/GoogleGemini/GoogleGemini";
import OpenAiGPT from "./features/OpenAiGPT/OpenAiGPT";
import { useState } from "react";
import { useStoryCreatorContext } from "./domain/Provider";

export const StoryCreatorContent = () => {
  const { store, manager } = useStoryCreatorContext();
  const { childInfo } = store.state;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Google Gemini" />
              <Tab label="OpenAi" />
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
                <Typography variant="h4">Google Gemini</Typography>
                <GoogleGemini />
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
                <OpenAiGPT />
              </Box>
            )}
          </div>
        </Box>
        {/* 
        <Card
          sx={{
            flexBasis: "50%",
            marginX: 1,
            padding: 2,
            height: "fit-content",
          }}
        >
          <Typography variant="h4">Google Gemini</Typography>
          <GoogleGemini />
        </Card>

        <Card sx={{ flexBasis: "100%", marginX: 1, padding: 2 }}>
          <OpenAiGPT />
        </Card> */}
      </Box>
    </>
  );
};
