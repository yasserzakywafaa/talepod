import { Box, Button, Typography } from "@mui/material";

import BunnyNoStoryFound from "../../../assets/images/sad_bunny_with_book_and_cloud.webp";
import { SearchOutlined } from "@mui/icons-material";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const StoryNotFound: React.FC = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.library);

  return (
    <>
      <Box component="div" className="no-results-container" width="100%">
        <Box
          sx={{ p: 3 }}
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="no-results-wrapper "
        >
          <Box component="div" className="no-results-image">
            <img src={BunnyNoStoryFound} width="100%" />
          </Box>

          <Box
            marginY={4}
            display="flex"
            component="div"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className="unauthorized-card-wrapper"
          >
            <Typography variant="h5" textAlign="center">
              We could not find the story you are looking for
            </Typography>

            <Button
              sx={{ marginY: "2rem" }}
              size="large"
              type="button"
              variant="outlined"
              endIcon={<SearchOutlined />}
              onClick={handleOnClick}
            >
              Browse Library
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StoryNotFound;
