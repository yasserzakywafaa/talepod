import { AppBar, Container, Toolbar } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";

import ApplicationBarDesktopView from "./features/ApplicationBarDesktopView";
import ApplicationBarMobileView from "./features/ApplicationBarMobileView";
import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import useDetectScroll from "src/shared/hooks/useDetectScroll";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useState } from "react";

export interface PagesMatch {
  isFeaturesPage: boolean;
  isCreatePage: boolean;
  isExplorePage: boolean;
  isPricingPage: boolean;
  isBlogsPage: boolean;
  isContactPage: boolean;
  isViewBlogPage: boolean;
  isMyStoriesPage: boolean;
  isMyProfilePage: boolean;
  isUnauthorized: boolean;
  isPrivacyPolicy: boolean;
  isTermsOfService: boolean;
  isLandingPage: boolean;
}

const ApplicationBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { isScrolledFromTop } = useDetectScroll();
  const { isDesktop } = useDeviceSize();

  const {
    store: {
      state: { themeMode, auth },
    },
  } = useApplicationContext();

  const goToLogin = () => navigate(routes.auth.login);
  const goToRegister = () => navigate(routes.auth.register);

  const isAppBarVisible = true;
  const pagesMatch: PagesMatch = {
    isFeaturesPage: !!useMatch(routes.features),
    isCreatePage: !!useMatch(routes.create),
    isExplorePage: !!useMatch(routes.explore),
    isPricingPage: !!useMatch(routes.pricing),
    isBlogsPage: !!useMatch(routes.blogs),
    isContactPage: !!useMatch(routes.contact),
    isViewBlogPage: !!useMatch(routes.blog(":id")),
    isMyStoriesPage: !!useMatch(routes.myStories(":userId")),
    isMyProfilePage: !!useMatch(routes.myProfile(":userId")),
    isUnauthorized: !!useMatch(routes.unauthorized),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isLandingPage: !!window.location.pathname.includes("blogs"),
  };

  const handleSetDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    switch (sectionId) {
      case "features":
        navigate(routes.features);
        break;
      case "explore":
        navigate(routes.explore);
        break;
      case "create":
        navigate(routes.create);
        break;
      case "pricing":
        navigate(routes.pricing);
        break;
      case "contact":
        navigate(routes.contact);
        break;
      case "original-stories":
        navigate(routes.explore);
        break;
      case "install":
        setIsInstallAppDialogOpen(true);
        return;
      case "my-stories":
        auth.user && navigate(routes.myStories(auth.user._id));
        return;

      default:
        scrollToSection(sectionId);
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      {isAppBarVisible && (
        <AppBar
          position="fixed"
          sx={{
            mt: 1,
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
          }}
        >
          <Container maxWidth="lg" className="application-bar-container">
            <Toolbar
              variant="regular"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                borderColor: "divider",
                boxShadow: isDesktop
                  ? (theme) =>
                      themeMode === "light"
                        ? `0 0 1px ${theme.palette.primary.light}`
                        : `0 0 1px ${theme.palette.primary.dark}`
                  : undefined,
              }}
            >
              <ApplicationBarDesktopView
                auth={auth}
                pagesMatch={pagesMatch}
                handleToggleLoginModal={goToLogin}
                handleToggleRegisterModal={goToRegister}
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                handleOnMenuItemClick={handleOnMenuItemClick}
              />

              <ApplicationBarMobileView
                auth={auth}
                pagesMatch={pagesMatch}
                isDrawerOpen={isDrawerOpen}
                isScrolledFromTop={isScrolledFromTop}
                handleSetDrawer={handleSetDrawer}
                handleToggleLoginModal={goToLogin}
                handleToggleRegisterModal={goToRegister}
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                handleOnMenuItemClick={handleOnMenuItemClick}
              />
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Modals */}
      <LoginModal />
      <RegisterModal />
      <InstallAppModal
        isInstallAppDialogOpen={isInstallAppDialogOpen}
        setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
      />
      <PricingModal />
      <CancelSubscriptionModal />
    </>
  );
};

export default ApplicationBar;
