import {
  AlternateEmailOutlined,
  AttachMoneyOutlined,
  AutoFixHighOutlined,
  LockOpenOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { Box, Button, MenuItem, MenuList, Typography } from "@mui/material";
import Logo, { LogoComponentEnum } from "../../Logo";
import {
  primaryColor,
  secondaryColorForDarkTheme,
} from "src/application/shared/themes";

import { Authentication } from "src/application/store/state";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { useDeviceSize } from "@yasserzakywafaa/client-core/web";
import { useTranslation } from "react-i18next";

interface ApplicationBarDesktopViewParams {
  auth: Authentication;
  pagesMatch: PagesMatch;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
}

const ApplicationBarDesktopView = (props: ApplicationBarDesktopViewParams) => {
  const {
    auth,
    pagesMatch,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { t } = useTranslation("common");
  const { isDesktop } = useDeviceSize();

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: secondaryColorForDarkTheme,
      },
      "& .MuiSvgIcon-root": {
        color: secondaryColorForDarkTheme,
      },
    },
  };

  const buttonHoverStyleSecondary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: primaryColor,
      },
      "& .MuiSvgIcon-root": {
        color: primaryColor,
      },
    },
  };

  const authNavButtonSx = {
    ...buttonHoverStyleSecondary,
    whiteSpace: "nowrap",
    flexShrink: 0,
    minWidth: "auto",
  };

  const authNavLabelSx = {
    color: "text.primary",
    whiteSpace: "nowrap",
  };

  if (!isDesktop) return null;

  return (
    <>
      <Box role="menu" sx={{ display: { xs: "none", md: "flex" } }}>
        <MenuList
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          <MenuItem
            className="menu-item"
            sx={{ ...buttonHoverStylePrimary }}
            onClick={handleOnMenuItemClick("features")}
          >
            <Logo
              variant="small"
              component={LogoComponentEnum.ANCHOR}
              style={{ width: "50px", height: "50px" }}
            />
          </MenuItem>

          <MenuItem
            className="menu-item"
            sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
            onClick={handleOnMenuItemClick("create")}
          >
            <AutoFixHighOutlined
              fontSize="medium"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Typography
              variant="body1"
              color={pagesMatch.isCreatePage ? primaryColor : "text.primary"}
            >
              {t("nav.createProject")}
            </Typography>
          </MenuItem>

          <MenuItem
            className="menu-item"
            sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
            onClick={handleOnMenuItemClick("library")}
          >
            <SearchOutlined fontSize="medium" color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="body1"
              color={pagesMatch.isLibraryPage ? primaryColor : "text.primary"}
            >
              {t("nav.library")}
            </Typography>
          </MenuItem>

          <MenuItem
            className="menu-item"
            sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
            onClick={handleOnMenuItemClick("pricing")}
          >
            <AttachMoneyOutlined
              fontSize="medium"
              color="primary"
              sx={{ mr: 0.5 }}
            />
            <Typography
              variant="body1"
              color={pagesMatch.isPricingPage ? primaryColor : "text.primary"}
            >
              {t("nav.pricing")}
            </Typography>
          </MenuItem>

          <MenuItem
            className="menu-item"
            sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
            onClick={handleOnMenuItemClick("contact")}
          >
            <AlternateEmailOutlined
              fontSize="medium"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Typography
              variant="body1"
              color={pagesMatch.isContactPage ? primaryColor : "text.primary"}
            >
              {t("nav.contact")}
            </Typography>
          </MenuItem>
        </MenuList>
      </Box>

      <Box
        sx={{
          gap: 0.5,
          alignItems: "center",
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
        }}
      >
        {auth.isAuthenticated ? (
          <UserAccountMenuButton
            user={auth.user as User}
            isMyProfilePage={pagesMatch.isMyProfilePage}
          />
        ) : (
          <>
            <Button
              variant="text"
              sx={authNavButtonSx}
              onClick={handleToggleRegisterModal}
            >
              <LockOpenOutlined
                fontSize="medium"
                color="secondary"
                sx={{ mr: 1, flexShrink: 0 }}
              />
              <Typography variant="body1" sx={authNavLabelSx}>
                {t("nav.register")}
              </Typography>
            </Button>

            <Button
              variant="text"
              sx={authNavButtonSx}
              onClick={handleToggleLoginModal}
            >
              <VpnKeyOutlined
                fontSize="medium"
                color="secondary"
                sx={{ mr: 1, flexShrink: 0 }}
              />
              <Typography variant="body1" sx={authNavLabelSx}>
                {t("nav.login")}
              </Typography>
            </Button>
          </>
        )}

        <SettingsMenuButton
          setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
        />
      </Box>
    </>
  );
};

export default ApplicationBarDesktopView;
