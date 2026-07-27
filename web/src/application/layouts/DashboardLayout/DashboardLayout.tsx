import "./DashboardLayout.scss";
import { useTranslation } from "react-i18next";

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import Logo, { LogoComponentEnum } from "src/components/shared/Logo";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CircularGradientBackground from "src/components/shared/CircularGradientBackground";
import DashboardBreadcrumbs from "./features/DashboardBreadcrumbs/DashboardBreadcrumbs";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { Notification } from "src/components/shared/Notification/Notification";
import SettingsMenuButton from "src/components/shared/SettingsMenuButton";
import UserAccountMenuButton from "src/components/shared/UserAccountButton";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { routes } from "../../../application/routes";
import { useApplicationContext } from "../../../application/store/Provider";
import { useIsRtl } from "@yasserzakywafaa/client-core/web/i18n";

const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64; // Material-UI default Toolbar height

interface DashboardMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const DashboardLayout = () => {
  const { t } = useTranslation("dashboard");
  const isRtl = useIsRtl();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    store: { state },
  } = useApplicationContext();

  const { auth } = state;
  const user = auth.user;

  // Redirect if not admin
  useEffect(() => {
    if (!auth.isAuthenticated || !user || !hasAdminRights(user)) {
      navigate(routes.unauthorized, { replace: true });
    }
  }, [auth.isAuthenticated, user, navigate]);

  const menuItems: DashboardMenuItem[] = [
    {
      label: t("nav.overview"),
      path: routes.dashboard.home,
      icon: <DashboardIcon />,
    },
    {
      label: t("nav.users"),
      path: routes.dashboard.users,
      icon: <PeopleIcon />,
    },
    {
      label: t("nav.stories"),
      path: routes.dashboard.stories,
      icon: <ArticleIcon />,
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar
        className="dashboard-sidebar-toolbar"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          minHeight: "64px !important",
          "& .MuiDrawer-paper": {
            "&.MuiDrawer-root": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Logo component={LogoComponentEnum.ANCHOR} style={{ width: "70%" }} />
      </Toolbar>

      <List sx={{ flexGrow: 1 }} disablePadding>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.contrastText" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box>
        <Divider orientation="horizontal" flexItem sx={{ my: 1, mx: "1rem" }} />

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            my: { xs: 3, sm: 2 },
          }}
        >
          {user && (
            <>
              <UserAccountMenuButton
                user={user}
                isDashboardPage={location.pathname === routes.dashboard.home}
              />
              <SettingsMenuButton
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (!auth.isAuthenticated || !user || !hasAdminRights(user)) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          pointerEvents: "none",
        }}
      />
      <CircularGradientBackground position="bottom" />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          position: "relative",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* AppBar for mobile */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            marginInlineStart: { md: `${DRAWER_WIDTH}px` },
            // bgcolor: "transparent",
            // backgroundImage: "none",
            color: "text.primary",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <DashboardBreadcrumbs />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            anchor={isRtl ? "right" : "left"}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            anchor={isRtl ? "right" : "left"}
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                backgroundColor: "transparent",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          className="dashboard-main"
          component="main"
          sx={{
            alignSelf: "end",
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            mt: { xs: `${APP_BAR_HEIGHT}px`, md: 0 },
            height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          }}
        >
          <Notification />
          <Outlet />
        </Box>

        <InstallAppModal
          isInstallAppDialogOpen={isInstallAppDialogOpen}
          setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
        />
      </Box>
    </>
  );
};

export default DashboardLayout;
