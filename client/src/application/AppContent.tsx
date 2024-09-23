import "./App.scss";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { darkTheme, lightTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import APP_CONSTANTS from "./shared/app_constants";
// import APP_CONSTANTS from "./shared/app_constants";
import { CssBaseline } from "@mui/material";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import NotFoundPage from "../Pages/NotFound/NotFound";
import { ThemeProvider } from "@emotion/react";
import { getApplicationInitialState } from "./store/state";
import { getLocalStorageAuthItems } from "src/shared/utils/localstorage";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "./routes";
import { useApplicationContext } from "./store/Provider";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const CreateStoryPage = lazy(() => import("../Pages/CreateStory/CreateStory"));
const ExplorePage = lazy(() => import("../Pages/Explore/Explore"));
const UsersStoriesPage = lazy(
  () => import("../Pages/UsersStories/UsersStories")
);
const MyStoriesPage = lazy(() => import("../Pages/MyStories/MyStories"));
const ContactPage = lazy(() => import("../Pages/Contact/Contact"));
const ViewStoryPage = lazy(() => import("../Pages/ViewStory/ViewStory"));
const CheckoutPage = lazy(() => import("../Pages/Checkout/CheckoutPage"));
const PrivacyPolicyPage = lazy(
  () => import("../Pages/PrivacyPolicy/PrivacyPolicy")
);
const TermsAndConditionsPage = lazy(
  () => import("../Pages/TermsAndConditions/TermsAndConditions")
);
const UnauthorizedPage = lazy(
  () => import("../Pages/Unauthorized/Unauthorized")
);

// Landing Pages
const BedtimeStoriesForKids = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForKids")
);
const BedtimeStoriesForAdults = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForAdults")
);
const ShortBedtimeStories = lazy(
  () => import("../Pages/LandingPages/ShortBedtimeStories")
);
const ChristmasBedtimeStories = lazy(
  () => import("../Pages/LandingPages/ChristmasBedtimeStories")
);
const BedtimeStoriesForGirlfriend = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForGirlfriend")
);
const BedtimeStoriesForToddlers = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForToddlers")
);
const EducationalBedtimeStories = lazy(
  () => import("../Pages/LandingPages/EducationalBedtimeStories")
);
const BabyBedtimeStories = lazy(
  () => import("../Pages/LandingPages/BabyBedtimeStories")
);
const BestBedtimeStories = lazy(
  () => import("../Pages/LandingPages/BestBedtimeStories")
);
const QuickBedtimeStories = lazy(
  () => import("../Pages/LandingPages/QuickBedtimeStories")
);

const AppContent = () => {
  const {
    store: { state, handleIsFetchingUserInfo },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const handleUpdates = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    if (!storedAuthInfo.isAuthenticated) {
      // User is not logged in, set initial auth state
      handleSetAuthInfo(getApplicationInitialState().auth);

      // return;
    } else {
      // User is already logged in, update auth state
      const userId = storedAuthInfo.user?._id;
      if (userId) {
        const fetchedUser = await handleFetchUserInfo(userId);

        handleSetAuthInfo({
          isAuthenticated: true,
          user: fetchedUser,
        });

        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser)
        );
      }
    }
    handleIsFetchingUserInfo(false);
  };

  useEffect(() => {
    handleUpdates();
  }, []);

  return (
    <ThemeProvider theme={state.themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />

      {state.isFetchingUserInfo && <LoaderSpinner />}

      {!state.isFetchingUserInfo && (
        <BrowserRouter>
          <Routes>
            <Route index path={routes.home} element={<HomePage />} />
            <Route path={routes.create} element={<CreateStoryPage />} />
            <Route path={routes.explore} element={<ExplorePage />} />

            {state.auth.isAuthenticated && !!state.auth.user ? (
              <>
                <Route
                  path={routes.myStories(":userId")}
                  element={<MyStoriesPage />}
                />

                <Route
                  path={routes.myStory(":userId", ":slug")}
                  element={<ViewStoryPage />}
                />

                {hasAdminRights(state.auth.user) && (
                  <Route
                    path={routes.usersStories}
                    element={<UsersStoriesPage />}
                  />
                )}
              </>
            ) : (
              <Route path="*" element={<Navigate to={routes.unauthorized} />} />
            )}

            <Route path={routes.contact} element={<ContactPage />} />
            <Route path={routes.story(":slug")} element={<ViewStoryPage />} />
            <Route
              path={routes.privacyPolicy}
              element={<PrivacyPolicyPage />}
            />
            <Route
              path={routes.termsAndConditions}
              element={<TermsAndConditionsPage />}
            />
            <Route path={routes.checkout} element={<CheckoutPage />} />
            <Route path={routes.unauthorized} element={<UnauthorizedPage />} />

            {/* Landing Pages */}
            <Route
              path={routes.landingPages.bedtimeStoriesForKids}
              element={<BedtimeStoriesForKids />}
            />
            <Route
              path={routes.landingPages.bedtimeStoriesForAdults}
              element={<BedtimeStoriesForAdults />}
            />
            <Route
              path={routes.landingPages.shortBedtimeStories}
              element={<ShortBedtimeStories />}
            />
            <Route
              path={routes.landingPages.christmasBedtimeStories}
              element={<ChristmasBedtimeStories />}
            />
            <Route
              path={routes.landingPages.bedtimeStoriesForGirlfriend}
              element={<BedtimeStoriesForGirlfriend />}
            />
            <Route
              path={routes.landingPages.bedtimeStoriesForToddlers}
              element={<BedtimeStoriesForToddlers />}
            />
            <Route
              path={routes.landingPages.educationalBedtimeStories}
              element={<EducationalBedtimeStories />}
            />
            <Route
              path={routes.landingPages.babyBedtimeStories}
              element={<BabyBedtimeStories />}
            />
            <Route
              path={routes.landingPages.bestBedtimeStories}
              element={<BestBedtimeStories />}
            />
            <Route
              path={routes.landingPages.quickBedtimeStories}
              element={<QuickBedtimeStories />}
            />
            {/* End of Landing Pages */}

            {/* Fallback route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
