import { Alert, Avatar, Box, Typography } from "@mui/material";

import { Story } from "src/components/StoryCreator/store/state";
import { User } from "src/shared/user";

interface ViewStoryAuthorInfoParams {
  story: Story;
  storyAuthor: User | undefined;
  handleUpdateStoryAuthor: (storyAuthor: User | undefined) => void;
}

const ViewStoryAuthorInfo = (props: ViewStoryAuthorInfoParams): JSX.Element => {
  const { storyAuthor } = props;

  if (!storyAuthor) return <></>;

  return (
    <Alert
      severity="info"
      variant="outlined"
      sx={{ width: "fit-content", alignItems: "center", mb: 2 }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 1 }}>
          <span>Created by:</span>
          <span className="bold">{` ${storyAuthor.name.givenName} ${storyAuthor.name.familyName}`}</span>
        </Typography>

        {storyAuthor.picture ? (
          <Avatar
            alt="User Picture"
            src={storyAuthor.picture}
            sx={{ mr: 1, width: 20, height: 20 }}
          />
        ) : (
          <Avatar sx={{ mr: 1, width: 20, height: 20 }}>
            {storyAuthor.name.givenName.charAt(0)}
            {storyAuthor.name.familyName.charAt(0)}
          </Avatar>
        )}
      </Box>
    </Alert>
  );
};

export default ViewStoryAuthorInfo;
