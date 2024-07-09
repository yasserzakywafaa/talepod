import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
// import Stack from "@mui/material/Stack";
// import TwitterIcon from "@mui/icons-material/X";
import Typography from "@mui/material/Typography";

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      <Link href="https://talepod.com/">TalePod&nbsp;</Link>
      {new Date().getFullYear()}
    </Typography>
  );
};

const Footer = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 4, sm: 8 },
        pb: { xs: 4, sm: 4 },
        pt: { xs: 2, sm: 2 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          display={{ xs: "flex", sm: "unset" }}
          flexDirection={{ xs: "column" }}
          mr={{ xs: 0, sm: 3 }}
        >
          <Link
            color="text.secondary"
            href="#"
            sx={{ mb: 2, mr: { xs: 0, sm: 2 } }}
          >
            Contact
          </Link>

          <Link
            color="text.secondary"
            href="#"
            sx={{ mb: 2, mr: { xs: 0, sm: 2 } }}
          >
            Privacy Policy
          </Link>

          <Link color="text.secondary" href="#" sx={{ mb: 2 }}>
            Terms of Service
          </Link>

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
