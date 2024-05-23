import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Logo from "src/components/shared/Logo/Logo";
import { useMatch, useNavigate } from "react-router-dom";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollToSection";
import ToggleColorMode from "src/components/shared/ToggleColorMode";

interface ApplicationBarProps {
  mode?: PaletteMode;
  toggleColorMode?: () => void;
}

const ApplicationBar = ({ mode, toggleColorMode }: ApplicationBarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Add all the pages the will contain the AppBar
  const pagesMatch = {
    isHomePage: !!useMatch(routes.home),
    isLandingPage: !!useMatch(routes.landing),
    isLoginPage: !!useMatch(routes.login),
    isRegisterPage: !!useMatch(routes.register),
    isCheckoutPage: !!useMatch(routes.checkout),
    isUnauthorizedPage: !!useMatch(routes.unauthorized),
  };
  const isNotFoundPage = Object.values(pagesMatch).every((p) => p === false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsOpen(newOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  const handleOnLoginClick = () => navigate(routes.login);
  const handleOnRegisterClick = () => navigate(routes.register);
  const handleOnLogoClick = () => navigate(routes.home);

  return (
    <>
      {!isNotFoundPage && (
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            mt: 2,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              variant="regular"
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderRadius: "4px",
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                border: "1px solid",
                borderColor: "divider",
                boxShadow:
                  theme.palette.mode === "light"
                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                    : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
              })}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  ml: "-18px",
                  px: 0,
                }}
              >
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="button"
                  onClick={handleOnLogoClick}
                >
                  <Logo />
                </Button>

                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <MenuItem
                    onClick={handleOnMenuItemClick("features")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Features
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    onClick={handleOnMenuItemClick("testimonials")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Testimonials
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    onClick={handleOnMenuItemClick("highlights")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Highlights
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    onClick={handleOnMenuItemClick("pricing")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Pricing
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    onClick={handleOnMenuItemClick("faq")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      FAQ
                    </Typography>
                  </MenuItem>
                </Box>
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <ToggleColorMode
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="button"
                  onClick={handleOnLoginClick}
                >
                  Log in
                </Button>

                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  component="button"
                  onClick={handleOnRegisterClick}
                >
                  Register
                </Button>
              </Box>

              {/* Mobile */}
              <Box sx={{ display: { sm: "", md: "none" } }}>
                <Button
                  variant="text"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ minWidth: "30px", p: "4px" }}
                >
                  <MenuIcon />
                </Button>

                <Drawer
                  anchor="right"
                  open={isOpen}
                  onClose={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      minWidth: "60dvw",
                      p: 2,
                      backgroundColor: "background.paper",
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        flexGrow: 1,
                      }}
                    >
                      <ToggleColorMode
                        mode={mode}
                        toggleColorMode={toggleColorMode}
                      />
                    </Box>

                    <MenuItem onClick={handleOnMenuItemClick("features")}>
                      Features
                    </MenuItem>

                    <MenuItem onClick={handleOnMenuItemClick("testimonials")}>
                      Testimonials
                    </MenuItem>

                    <MenuItem onClick={handleOnMenuItemClick("highlights")}>
                      Highlights
                    </MenuItem>

                    <MenuItem onClick={handleOnMenuItemClick("pricing")}>
                      Pricing
                    </MenuItem>

                    <MenuItem onClick={handleOnMenuItemClick("faq")}>
                      FAQ
                    </MenuItem>

                    <Divider />

                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        component="button"
                        onClick={handleOnRegisterClick}
                        sx={{ width: "100%" }}
                      >
                        Register
                      </Button>
                    </MenuItem>

                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        component="button"
                        sx={{ width: "100%" }}
                        onClick={handleOnLoginClick}
                      >
                        Log in
                      </Button>
                    </MenuItem>
                  </Box>
                </Drawer>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
};

export default ApplicationBar;
