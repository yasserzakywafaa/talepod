import { AppBar, Container, Toolbar } from "@mui/material";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import ApplicationBarDesktopView from "./features/ApplicationBarDesktopView";
import ApplicationBarMobileView from "./features/ApplicationBarMobileView";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import { routes } from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import { useAppResolvedThemeMode } from "src/application/hooks/useAppResolvedThemeMode";
import useDetectScroll from "src/shared/hooks/useDetectScroll";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useState } from "react";
import { trackEvent } from "src/shared/utils/ga4";

export interface PagesMatch {
  isFeaturesPage: boolean;
  isCreatePage: boolean;
  isLibraryPage: boolean;
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
  const location = useLocation();
  const localizedPath = useLocalizedPath();
  const { isScrolledFromTop } = useDetectScroll();
  const { isDesktop } = useDeviceSize();

  const themeMode = useAppResolvedThemeMode();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const goToLogin = () => navigate(routes.auth.login);
  const goToRegister = () => navigate(routes.auth.register);

  const isAppBarVisible = true;
  const pagesMatch: PagesMatch = {
    isFeaturesPage: !!useMatch({ path: "/:locale", end: true }),
    isCreatePage: !!useMatch("/:locale/create"),
    isLibraryPage: !!useMatch("/:locale/bedtime-stories"),
    isPricingPage: !!useMatch("/:locale/pricing"),
    isBlogsPage: !!useMatch(routes.blogs),
    isContactPage: !!useMatch("/:locale/contact"),
    isViewBlogPage: !!useMatch(routes.blog(":id")),
    isMyStoriesPage: !!useMatch(routes.myStories(":userId")),
    isMyProfilePage: !!useMatch(routes.myProfile(":userId")),
    isUnauthorized: !!useMatch(routes.unauthorized),
    isPrivacyPolicy: !!useMatch("/:locale/privacy-policy"),
    isTermsOfService: !!useMatch("/:locale/terms-and-conditions"),
    isLandingPage: Object.values(routes.landingPages).some((segment) =>
      location.pathname.endsWith(`/${segment}`),
    ),
  };

  const handleSetDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    const navLinkNames: Record<string, string> = {
      features: "home",
      create: "create",
      library: "library",
      pricing: "pricing",
      contact: "contact",
      "original-stories": "library",
      "my-stories": "my_stories",
      install: "install",
    };

    const linkName = navLinkNames[sectionId];
    if (linkName) {
      trackEvent("nav_click", { link_name: linkName });
    }

    switch (sectionId) {
      case "features":
        navigate(localizedPath(routes.features));
        break;
      case "library":
        navigate(localizedPath(routes.library));
        break;
      case "create":
        navigate(localizedPath(routes.create));
        break;
      case "pricing":
        navigate(localizedPath(routes.pricing));
        break;
      case "contact":
        navigate(localizedPath(routes.contact));
        break;
      case "original-stories":
        navigate(localizedPath(routes.library));
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
          color="transparent"
          sx={{
            mt: 1,
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            color: "text.primary",
            zIndex: (theme) => theme.zIndex.appBar,
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
                width: "100%",
                minHeight: { xs: 56, md: 64 },
                py: 1,
                backdropFilter: "blur(24px)",
                borderColor: "divider",
                borderRadius: "var(--r-xl) var(--r-xl)",
                boxShadow: isDesktop
                  ? (theme) =>
                      themeMode === "light"
                        ? `0 0 1px ${theme.palette.primary.light}`
                        : `0 0 1px ${theme.palette.primary.dark}`
                  : undefined,
              }}
            >
              {isDesktop ? (
                <ApplicationBarDesktopView
                  auth={auth}
                  pagesMatch={pagesMatch}
                  handleToggleLoginModal={goToLogin}
                  handleToggleRegisterModal={goToRegister}
                  setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  handleOnMenuItemClick={handleOnMenuItemClick}
                />
              ) : (
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
              )}
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
    </>
  );
};

export default ApplicationBar;
