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
import routes from "./routes";
import { useApplicationContext } from "./store/Provider";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const CreateStoryPage = lazy(() => import("../Pages/CreateStory/CreateStory"));
const ExplorePage = lazy(() => import("../Pages/Explore/Explore"));
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
              </>
            ) : (
              <Route path="*" element={<Navigate to={routes.unauthorized} />} />
            )}

            <Route path={routes.contact} element={<ContactPage />} />

            <Route path={routes.story(":slug")} element={<ViewStoryPage />} />

            {/* Landing Pages */}
            {Object.values(routes.landingPages).map(
              (route: string, index: number) => (
                <Route key={index} path={route} element={<ExplorePage />} />
              )
            )}
            {/* End of Landing Pages */}

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

            {/* Fallback route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
