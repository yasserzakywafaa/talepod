import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { darkTheme, lightTheme } from "./shared/themes";

import { CssBaseline } from "@mui/material";
import NotFoundPage from "../Pages/NotFound/NotFound";
import { ThemeProvider } from "@emotion/react";
import { lazy } from "react";
import routes from "./routes";
import { useApplicationContext } from "./store/Provider";

// import "./shared/components/TinyMCE";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const CreateStoryPage = lazy(() => import("../Pages/CreateStory/CreateStory"));
const ExplorePage = lazy(() => import("../Pages/Explore/Explore"));
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
  } = useApplicationContext();

  return (
    <ThemeProvider theme={state.themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route index path={routes.home} element={<HomePage />} />

          <Route index path={routes.create} element={<CreateStoryPage />} />

          <Route index path={routes.explore} element={<ExplorePage />} />

          <Route index path={routes.contact} element={<ContactPage />} />

          <Route
            index
            path={routes.story(":slug")}
            element={<ViewStoryPage />}
          />

          {/* Landing Pages */}
          {Object.values(routes.landingPages).map((route: string) => (
            <Route index path={route} element={<ExplorePage />} />
          ))}
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
