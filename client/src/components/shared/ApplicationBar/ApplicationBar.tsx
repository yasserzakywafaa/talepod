import { useMatch, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import Logo from "src/components/shared/Logo/Logo";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import ToggleColorMode from "src/components/shared/ToggleColorMode";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollToSection";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

const ApplicationBar = () => {
  const navigate = useNavigate();

  const {
    store: {
      state: { themeMode },
      toggleThemeMode,
    },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Add all the pages the will contain the AppBar
  const pagesMatch = {
    isHomePage: !!useMatch(routes.home),
    isCheckoutPage: !!useMatch(routes.checkout),
    isUnauthorizedPage: !!useMatch(routes.unauthorized),
  };
  const isNotFoundPage = Object.values(pagesMatch).every((p) => p === false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    scrollToSection(sectionId);
    setIsDrawerOpen(false);
  };

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
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderRadius: "4px",
                bgcolor:
                  themeMode === "light"
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                border: "1px solid",
                borderColor: "divider",
                boxShadow:
                  themeMode === "light"
                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                    : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
              }}
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

                  {/* 
                  <MenuItem
                    onClick={handleOnMenuItemClick("testimonials")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Testimonials
                    </Typography>
                  </MenuItem> */}

                  {/* <MenuItem
                    onClick={handleOnMenuItemClick("highlights")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Highlights
                    </Typography>
                  </MenuItem> */}

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
                  mode={themeMode}
                  toggleColorMode={toggleThemeMode}
                />
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="button"
                  onClick={handleToggleLoginModal}
                >
                  Log in
                </Button>

                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  component="button"
                  onClick={handleToggleRegisterModal}
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
                  open={isDrawerOpen}
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
                        mode={themeMode}
                        toggleColorMode={toggleThemeMode}
                      />
                    </Box>

                    <MenuItem onClick={handleOnMenuItemClick("features")}>
                      Features
                    </MenuItem>

                    {/* <MenuItem onClick={handleOnMenuItemClick("testimonials")}>
                      Testimonials
                    </MenuItem> */}

                    {/* <MenuItem onClick={handleOnMenuItemClick("highlights")}>
                      Highlights
                    </MenuItem> */}

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
                        onClick={handleToggleRegisterModal}
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
                        onClick={handleToggleLoginModal}
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

      {/* Modals */}
      <LoginModal />
      <RegisterModal />
    </>
  );
};

export default ApplicationBar;
