import "./Unauthorized.scss";

import { Box, Button, Typography } from "@mui/material";

import BunnySurprised from "../../assets/images/unauthorized_401/surprised_bunny.png";
import { HomeOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.home);

  return (
    <Page title="Unauthorized | TalePod" className="unauthorized-page">
      <Box
        display="flex"
        component="div"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Box component="div" className="unauthorized-image">
          <img src={BunnySurprised} alt="unauthorized-image" width="100%" />
        </Box>

        <Box
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="unauthorized-card-wrapper"
        >
          <Typography variant="h4">Unauthorized</Typography>
          <Typography variant="h5" textAlign="center">
            Please contact your administrator
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
  );
};

export default Unauthorized;
