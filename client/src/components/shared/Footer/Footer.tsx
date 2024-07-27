import "./Footer.scss";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      <Link href={routes.home}>TalePod&nbsp;</Link>
      {new Date().getFullYear()}
    </Typography>
  );
};

const Footer = () => {
  const navigate = useNavigate();

  const handleFooterLinkItemClick =
    (name: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      switch (name) {
        case "privacy-policy":
          navigate(routes.privacyPolicy);
          break;

        case "terms-and-conditions":
          navigate(routes.termsAndConditions);
          break;
      }
    };

  return (
    <Container
      className="footer"
      sx={{
        gap: { xs: 4, sm: 8 },
        // mt: { xs: 2, sm: 2 },
        p: { xs: 2, sm: 2 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" justifyContent="center" alignContent="center">
          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.privacyPolicy}
            onClick={handleFooterLinkItemClick("privacy-policy")}
          >
            Privacy Policy
          </Link>

          <Divider
            variant="middle"
            orientation="vertical"
            sx={{ width: "3px", height: "20px", mx: 1 }}
          />

          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.termsAndConditions}
            onClick={handleFooterLinkItemClick("terms-and-conditions")}
          >
            Terms and Conditions
          </Link>
        </Box>

        <Box display="flex" justifyContent="center" alignContent="center">
          <Copyright />
        </Box>

        {/* <Stack
          direction="row"
          justifyContent="left"
          spacing={1}
          useFlexGap
          sx={{
            color: "text.secondary",
          }}
        >
          <IconButton
            color="inherit"
            href="https://twitter.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: "center" }}
          >
            <TwitterIcon />
          </IconButton>
        </Stack> */}
      </Box>
    </Container>
  );
};

export default Footer;
