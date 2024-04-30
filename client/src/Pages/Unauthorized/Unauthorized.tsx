import "./Unauthorized.scss";

import { ReactComponent as UnauthorizedSVG } from "../../assets/images/unauthorized_401/unauthorized_401_2.svg";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import routes from "src/application/routes";
import Page from "src/components/shared/Page/Page";

const Unauthorized = () => {
  const navigate = useNavigate();
  const handleOnClick = () => navigate(routes.home);

  return (
    <Page title="AI Story Creator" className="unauthorized-page">
      <Box
        display="flex"
        component="div"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Box component="div" className="unauthorized-image">
          <UnauthorizedSVG />
        </Box>

        <Box
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          className="unauthorized-card-wrapper"
        >
          <Typography variant="h3">
            Please contact your administrator
          </Typography>

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
  );
};

export default Unauthorized;
