import "./StoryCreator.scss";

import { Container } from "@mui/material";
import CreateStoryForm from "./features/CreateStoryForm";

export const StoryCreatorContent = () => {
  return (
    <Container
      className="story-creator-container"
      sx={{ pt: { xs: 4, sm: 4 }, paddingX: 0 }}
    >
      <CreateStoryForm />
    </Container>
  );
};
