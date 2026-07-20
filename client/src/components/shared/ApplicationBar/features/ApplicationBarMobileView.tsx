import {
  AlternateEmailOutlined,
  AttachMoneyOutlined,
  AutoFixHighOutlined,
  EarbudsOutlined,
  LockOpenOutlined,
  MenuOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import Logo, { LogoComponentEnum } from "../../Logo";

import { Authentication } from "src/application/store/state";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { primaryColor } from "src/application/shared/themes";
import { useDeviceSize } from "@yasserzakywafaa/client-core/web";
import { useTranslation } from "react-i18next";

interface ApplicationBarMobileViewParams {
  auth: Authentication;
  isDrawerOpen: boolean;
  pagesMatch: PagesMatch;
  isScrolledFromTop: boolean;
  handleSetDrawer: (newState: boolean) => () => void;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
}

const ApplicationBarMobileView = (props: ApplicationBarMobileViewParams) => {
  const {
    auth,
    pagesMatch,
    isDrawerOpen,
    isScrolledFromTop,
    handleSetDrawer,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { t } = useTranslation("common");
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  if (isDesktop || (!isTablet && !isMobile)) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flex: 1,
        minWidth: 0,
      }}
    >
      {pagesMatch.isFeaturesPage ? (
        !isScrolledFromTop ? (
          <Box sx={{ width: "80px" }}>
            <Logo
              variant="small"
              component={LogoComponentEnum.ANCHOR}
              style={{ width: "100%", height: "100%", maxWidth: "60px" }}
            />
          </Box>
        ) : (
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={handleOnMenuItemClick("create")}
          >
            {t("nav.createProject")}
          </Button>
        )
      ) : (
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={handleOnMenuItemClick("create")}
        >
          {t("nav.createProject")}
        </Button>
      )}

      <Button
        variant="outlined"
        color="primary"
        aria-label="menu"
        onClick={handleSetDrawer(true)}
        sx={{ minWidth: "30px", p: "4px" }}
      >
        <MenuOutlined fontSize="medium" />
      </Button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleSetDrawer(false)}
      >
        <Box
          role="menu"
          sx={{
            p: 1,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            minWidth: "50dvw",
            backgroundColor: "background.paper",
          }}
        >
          <MenuList disablePadding>
            <MenuItem
              className="menu-item"
              onClick={handleOnMenuItemClick("features")}
            >
              <EarbudsOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                color={
                  pagesMatch.isFeaturesPage ? primaryColor : "text.primary"
                }
              >
                {t("nav.features")}
              </Typography>
            </MenuItem>

            <MenuItem
              className="menu-item"
              onClick={handleOnMenuItemClick("create")}
            >
              <AutoFixHighOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                color={pagesMatch.isCreatePage ? primaryColor : "text.primary"}
              >
                {t("nav.createProject")}
              </Typography>
            </MenuItem>

            <Divider
              orientation="horizontal"
              flexItem
              sx={{ my: 1, width: "30%", mx: "2rem" }}
            />

            <MenuItem
              className="menu-item"
              onClick={handleOnMenuItemClick("library")}
            >
              <SearchOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                color={
                  pagesMatch.isLibraryPage ? primaryColor : "text.primary"
                }
              >
                {t("nav.library")}
              </Typography>
            </MenuItem>

            <MenuItem
              className="menu-item"
              onClick={handleOnMenuItemClick("pricing")}
            >
              <AttachMoneyOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                color={
                  pagesMatch.isPricingPage ? primaryColor : "text.primary"
                }
              >
                {t("nav.pricing")}
              </Typography>
            </MenuItem>

            <Divider
              orientation="horizontal"
              flexItem
              sx={{ my: 1, width: "30%", mx: "2rem" }}
            />

            <MenuItem
              className="menu-item"
              onClick={handleOnMenuItemClick("contact")}
            >
              <AlternateEmailOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                color={
                  pagesMatch.isContactPage ? primaryColor : "text.primary"
                }
              >
                {t("nav.contact")}
              </Typography>
            </MenuItem>
          </MenuList>

          <MenuList disablePadding sx={{ mb: 2 }}>
            {auth.isAuthenticated ? (
              <Box sx={{ px: 2, py: 1 }}>
                <UserAccountMenuButton
                  user={auth.user as User}
                  isMyProfilePage={pagesMatch.isMyProfilePage}
                />
              </Box>
            ) : (
              <>
                <MenuItem onClick={handleToggleRegisterModal}>
                  <LockOpenOutlined
                    fontSize="medium"
                    color="secondary"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    {t("nav.register")}
                  </Typography>
                </MenuItem>

                <MenuItem onClick={handleToggleLoginModal}>
                  <VpnKeyOutlined
                    fontSize="medium"
                    color="secondary"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    {t("nav.login")}
                  </Typography>
                </MenuItem>
              </>
            )}

            <Box sx={{ px: 2, py: 1 }}>
              <SettingsMenuButton
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
              >
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {t("settings.menu")}
                </Typography>
              </SettingsMenuButton>
            </Box>
          </MenuList>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ApplicationBarMobileView;
