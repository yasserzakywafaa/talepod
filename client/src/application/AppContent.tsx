import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { darkTheme, lightTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import APP_CONSTANTS from "./shared/app_constants";
// import APP_CONSTANTS from "./shared/app_constants";
import { CssBaseline } from "@mui/material";
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
    store: { state },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const handleUpdates = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    if (!storedAuthInfo.isAuthenticated) {
      // User is not logged in, set initial auth state
      handleSetAuthInfo(getApplicationInitialState().auth);

      return;
    } else {
      // // User is already logged in, update auth state
      const userId = storedAuthInfo.user?.userId;
      if (userId) {
        const fetchedUser = await handleFetchUserInfo(userId);
        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser)
        );
      }
    }
  };

  useEffect(() => {
    handleUpdates();
  }, []);

  return (
    <ThemeProvider theme={state.themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route index path={routes.home} element={<HomePage />} />

          <Route index path={routes.create} element={<CreateStoryPage />} />

          <Route index path={routes.explore} element={<ExplorePage />} />

          {state.auth.isAuthenticated && !!state.auth.user ? (
            <>
              <Route
                index
                path={routes.myStories(":userId")}
                element={<MyStoriesPage />}
              />

              <Route
                index
                path={routes.myStory(":userId", ":slug")}
                element={<ViewStoryPage />}
              />
            </>
          ) : (
            <Route path={routes.unauthorized} element={<UnauthorizedPage />} />
          )}

          <Route index path={routes.contact} element={<ContactPage />} />

          <Route
            index
            path={routes.story(":slug")}
            element={<ViewStoryPage />}
          />

          {/* Landing Pages */}
          {Object.values(routes.landingPages).map(
            (route: string, index: number) => (
              <Route index key={index} path={route} element={<ExplorePage />} />
            )
          )}
          {/* End of Landing Pages */}

          <Route path={routes.privacyPolicy} element={<PrivacyPolicyPage />} />

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
    </ThemeProvider>
  );
};

export default AppContent;
