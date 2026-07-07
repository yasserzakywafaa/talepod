import { Box, Typography } from "@mui/material";

import NotFound404 from "../../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";

const NoResultsFound: React.FC = () => {
  return (
    <>
      <Box component="div" className="no-results-container" sx={{
        width: "100%"
      }}>
        <Box
          component="div"
          className="no-results-wrapper "
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            p: 3
          }}>
          <Box component="div" className="no-results-image">
            <img src={NotFound404} width="100%" />
          </Box>

          <Box
            component="div"
            className="unauthorized-card-wrapper"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}>
            <Typography variant="h5">No Stories Found</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NoResultsFound;
