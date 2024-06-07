import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import routes from "src/application/routes";
import Page from "src/components/shared/Page/Page";
import { ReactComponent as NotFound404 } from "../../assets/images/not_found_404/not_found_404_2.svg";

import "./NotFound.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.home);

  return (
    <>
      <Box component="div" className="not-found-page">
        <Page title="Not Found | TalePod">
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
              <Typography variant="h3">Page Not Found</Typography>

              <Button
                sx={{ marginY: "4rem" }}
                size="large"
                type="button"
                variant="contained"
                onClick={handleOnClick}
              >
                Go back home
              </Button>
            </Box>
          </Box>
        </Page>
      </Box>
    </>
  );
};

export default NotFoundPage;
