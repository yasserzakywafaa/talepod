import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { darkTheme, lightTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import NotFoundPage from "../Pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeProvider } from "@emotion/react";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "./routes";
import { useApplicationContext } from "./store/Provider";

const FeaturesPage = lazy(() => import("../Pages/Features/FeaturesPage"));
const PricingPage = lazy(() => import("../Pages/Pricing/Pricing"));
const CreateStoryPage = lazy(() => import("../Pages/CreateStory/CreateStory"));
const LibraryPage = lazy(() => import("../Pages/Library/Library"));
const UsersStoriesPage = lazy(
  () => import("../Pages/UsersStories/UsersStories"),
);
const MyStoriesPage = lazy(() => import("../Pages/MyStories/MyStories"));

const BlogsPage = lazy(() => import("../Pages/Blogs/Blogs"));
const BlogPage = lazy(() => import("../Pages/Blog/Blog"));

const MyProfilePage = lazy(() => import("../Pages/MyProfile/MyProfile"));
const ContactPage = lazy(() => import("../Pages/Contact/Contact"));
const ViewStoryPage = lazy(() => import("../Pages/ViewStory/ViewStory"));
const LoginPage = lazy(() => import("../Pages/Login"));
const RegisterPage = lazy(() => import("../Pages/Register"));
const LogoutPage = lazy(() => import("../Pages/Logout"));
const PaymentStatusPage = lazy(
  () => import("../Pages/PaymentStatus/PaymentStatus"),
);
const PrivacyPolicyPage = lazy(
  () => import("../Pages/PrivacyPolicy/PrivacyPolicy"),
);
const TermsAndConditionsPage = lazy(
  () => import("../Pages/TermsAndConditions/TermsAndConditions"),
);
const UnauthorizedPage = lazy(
  () => import("../Pages/Unauthorized/Unauthorized"),
);

// Landing Pages
const BedtimeStoriesForKids = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForKids"),
);
const BedtimeStoriesForAdults = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForAdults"),
);
const ShortBedtimeStories = lazy(
  () => import("../Pages/LandingPages/ShortBedtimeStories"),
);
const ChristmasBedtimeStories = lazy(
  () => import("../Pages/LandingPages/ChristmasBedtimeStories"),
);
const BedtimeStoriesForGirlfriend = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForGirlfriend"),
);
const BedtimeStoriesForToddlers = lazy(
  () => import("../Pages/LandingPages/BedtimeStoriesForToddlers"),
);
const EducationalBedtimeStories = lazy(
  () => import("../Pages/LandingPages/EducationalBedtimeStories"),
);
const BabyBedtimeStories = lazy(
  () => import("../Pages/LandingPages/BabyBedtimeStories"),
);
const BestBedtimeStories = lazy(
  () => import("../Pages/LandingPages/BestBedtimeStories"),
);
const QuickBedtimeStories = lazy(
  () => import("../Pages/LandingPages/QuickBedtimeStories"),
);

// Dashboard Layout and Pages
const DashboardLayout = lazy(
  () => import("./layouts/DashboardLayout/DashboardLayout"),
);
const DashboardPage = lazy(
  () => import("../Pages/Dashboard/DashboardOverview/DashboardOverview"),
);
const DashboardUsersPage = lazy(
  () => import("../Pages/Dashboard/DashboardUsers/DashboardUsers"),
);
const DashboardStoriesPage = lazy(
  () => import("../Pages/Dashboard/DashboardStories/DashboardStories"),
);
const DashboardUser = lazy(
  () => import("../Pages/Dashboard/DashboardUser/DashboardUser"),
);
const DashboardUserStoriesPage = lazy(
  () => import("../Pages/Dashboard/DashboardUser/features/UserStoriesPage"),
);

const AppContent = () => {
  const {
    store: { state },
    manager: { handleInitialAuthentication },
  } = useApplicationContext();

  useEffect(() => {
    handleInitialAuthentication();
  }, []);

  return (
    <ThemeProvider theme={state.themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />

      {state.isFetchingUserInfo && <LoaderSpinner />}

      {!state.isFetchingUserInfo && (
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route index path={routes.features} element={<FeaturesPage />} />
            <Route path={routes.pricing} element={<PricingPage />} />
            <Route path={routes.contact} element={<ContactPage />} />
            <Route
              path={routes.privacyPolicy}
              element={<PrivacyPolicyPage />}
            />
            <Route
              path={routes.termsAndConditions}
              element={<TermsAndConditionsPage />}
            />
            <Route path={routes.unauthorized} element={<UnauthorizedPage />} />
            <Route path={routes.auth.login} element={<LoginPage />} />
            <Route path={routes.auth.register} element={<RegisterPage />} />
            <Route path={routes.auth.logout} element={<LogoutPage />} />

            {/* Story Creation Routes */}
            <Route path={routes.create} element={<CreateStoryPage />} />

            {/* Story Viewing Routes */}
            <Route path={routes.library} element={<LibraryPage />} />
            <Route path={routes.story(":slug")} element={<ViewStoryPage />} />
            <Route
              path={routes.myStory(":userId", ":slug")}
              element={<ViewStoryPage />}
            />

            {/* Blog Routes */}
            <Route path={routes.blogs} element={<BlogsPage />} />
            <Route path={routes.blog(":slug")} element={<BlogPage />} />

            {/* Authenticated user routes */}
            <Route
              path={routes.myStories(":userId")}
              element={
                <ProtectedRoute>
                  <MyStoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={routes.myProfile(":userId")}
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={routes.paymentStatus(":sessionId")}
              element={
                <ProtectedRoute>
                  <PaymentStatusPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            {state.auth.isAuthenticated &&
              !!state.auth.user &&
              hasAdminRights(state.auth.user) && (
                <>
                  <Route
                    path={routes.usersStories}
                    element={
                      <ProtectedRoute>
                        <UsersStoriesPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path={routes.dashboard.base}
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<DashboardUsersPage />} />
                    <Route
                      path={routes.dashboard.viewUser(":userId")}
                      element={<DashboardUser />}
                    />
                    <Route
                      path={routes.dashboard.viewUserStories(":userId")}
                      element={<DashboardUserStoriesPage />}
                    />
                    <Route
                      path={routes.dashboard.stories}
                      element={<DashboardStoriesPage />}
                    />
                  </Route>
                </>
              )}

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

            {/* Fallback route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
