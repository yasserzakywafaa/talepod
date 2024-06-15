import { Box, Button, Typography } from "@mui/material";

import { ReactComponent as NotFound404 } from "../../../assets/images/no_results_found.svg";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const NoResultsFound: React.FC = () => {
  const navigate = useNavigate();
  const handleOnCreateClick = () => navigate(routes.create);

  return (
    <>
      <Box component="div" className="not-found-page">
        <Box
          sx={{ p: 3 }}
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="not-found-card-wrapper "
        >
          <Box component="div" className="not-found-image">
            <NotFound404 />
          </Box>

          <Box
            display="flex"
            component="div"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className="unauthorized-card-wrapper"
          >
            <Typography variant="h3">No Stories Found</Typography>

            <Button
              sx={{ marginY: "4rem" }}
              size="large"
              type="button"
              variant="contained"
              onClick={handleOnCreateClick}
            >
              Create Story
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NoResultsFound;
