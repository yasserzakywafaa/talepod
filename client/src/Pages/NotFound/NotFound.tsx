import "./NotFound.scss";

import { Box, Button, Typography } from "@mui/material";

import BunnyNotFound from "../../assets/images/not_found_404/confused_bunny_with_magnifier.webp";
import { HomeOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.features);

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
              <img src={BunnyNotFound} width="100%" />
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
                Page Not Found
              </Typography>

              <Button
                sx={{ marginY: "2rem" }}
                size="large"
                type="button"
                variant="contained"
                endIcon={<HomeOutlined />}
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
