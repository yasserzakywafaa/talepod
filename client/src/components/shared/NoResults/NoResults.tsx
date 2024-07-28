import { Box, Typography } from "@mui/material";

import NotFound404 from "../../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";

const NoResultsFound: React.FC = () => {
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
            <img src={NotFound404} width="100%" />
          </Box>

          <Box
            display="flex"
            component="div"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            className="unauthorized-card-wrapper"
          >
            <Typography variant="h5">No Stories Found</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NoResultsFound;
