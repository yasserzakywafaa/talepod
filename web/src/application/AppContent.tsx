import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getThemedTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import GenerationProgressChip from "src/components/StoryCreator/generation/GenerationProgressChip";
import Ga4PageView from "src/components/analytics/Ga4PageView";
import Ga4ScrollDepth from "src/components/analytics/Ga4ScrollDepth";
import CookiePolicy from "src/components/shared/CookiePolicy/CookiePolicy";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import NotFoundPage from "../Pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeProvider } from "@mui/material/styles";
import {
  LocaleProvider,
  LocaleLayout,
  LocaleRedirect,
  useAppDirection,
} from "@yasserzakywafaa/client-core/web/i18n";
import i18n from "src/i18n/init";
import { ALL_PUBLIC_SEGMENTS, routes } from "./routes";
import { useApplicationContext } from "./store/Provider";
import { useAppResolvedThemeMode } from "./hooks/useAppResolvedThemeMode";
import { applyThemeToDOM } from "./store/store";

const FeaturesPage = lazy(() => import("../Pages/Features/FeaturesPage"));
const PricingPage = lazy(() => import("../Pages/Pricing/Pricing"));
const CreateStoryPage = lazy(() => import("../Pages/CreateStory/CreateStory"));
const LibraryPage = lazy(() => import("../Pages/Library/Library"));
const UsersStoriesPage = lazy(
  () => import("../Pages/UsersStories/UsersStories"),
);
const MyStoriesPage = lazy(() => import("../Pages/MyStories/MyStories"));
const AvatarsPage = lazy(() => import("../Pages/Avatars/Avatars"));

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
const Alternatives = lazy(() => import("../Pages/LandingPages/Alternatives"));
const PersonalizedBedtimeStoryGenerator = lazy(
  () => import("../Pages/LandingPages/PersonalizedBedtimeStoryGenerator"),
);

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
  const direction = useAppDirection();
  const resolvedThemeMode = useAppResolvedThemeMode();
  const theme = getThemedTheme(resolvedThemeMode, direction);

  useEffect(() => {
    handleInitialAuthentication();
  }, []);

  useEffect(() => {
    applyThemeToDOM(resolvedThemeMode);
  }, [resolvedThemeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {state.isFetchingUserInfo && <LoaderSpinner />}

      {!state.isFetchingUserInfo && (
        <BrowserRouter>
          <LocaleProvider publicSegments={ALL_PUBLIC_SEGMENTS} i18n={i18n}>
            <Ga4PageView />
            <Ga4ScrollDepth />
            <Routes>
              <Route
                path={routes.root}
                element={<LocaleRedirect />}
              />

              {/* Flat routes — must stay outside /:locale (auth, app, admin) */}
              <Route path={routes.unauthorized} element={<UnauthorizedPage />} />
              <Route path={routes.auth.login} element={<LoginPage />} />
              <Route path={routes.auth.register} element={<RegisterPage />} />
              <Route path={routes.auth.logout} element={<LogoutPage />} />

              <Route path={routes.story(":slug")} element={<ViewStoryPage />} />
              <Route
                path={routes.myStory(":userId", ":slug")}
                element={<ViewStoryPage />}
              />

              <Route path={routes.blogs} element={<BlogsPage />} />
              <Route path={routes.blog(":slug")} element={<BlogPage />} />

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
                path={routes.avatars}
                element={
                  <ProtectedRoute>
                    <AvatarsPage />
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

              <Route path="/:locale" element={<LocaleLayout i18n={i18n} />}>
                <Route index element={<FeaturesPage />} />
                <Route path={routes.pricing} element={<PricingPage />} />
                <Route path={routes.contact} element={<ContactPage />} />
                <Route path={routes.library} element={<LibraryPage />} />
                <Route path={routes.create} element={<CreateStoryPage />} />
                <Route
                  path={routes.bedtimeStoriesForKids}
                  element={<BedtimeStoriesForKids />}
                />
                <Route
                  path={routes.bedtimeStoriesForAdults}
                  element={<BedtimeStoriesForAdults />}
                />
                <Route
                  path={routes.shortBedtimeStories}
                  element={<ShortBedtimeStories />}
                />
                <Route
                  path={routes.christmasBedtimeStories}
                  element={<ChristmasBedtimeStories />}
                />
                <Route
                  path={routes.bedtimeStoriesForGirlfriend}
                  element={<BedtimeStoriesForGirlfriend />}
                />
                <Route
                  path={routes.bedtimeStoriesForToddlers}
                  element={<BedtimeStoriesForToddlers />}
                />
                <Route
                  path={routes.educationalBedtimeStories}
                  element={<EducationalBedtimeStories />}
                />
                <Route
                  path={routes.babyBedtimeStories}
                  element={<BabyBedtimeStories />}
                />
                <Route
                  path={routes.bestBedtimeStories}
                  element={<BestBedtimeStories />}
                />
                <Route
                  path={routes.quickBedtimeStories}
                  element={<QuickBedtimeStories />}
                />
                <Route
                  path={routes.alternatives}
                  element={<Alternatives />}
                />
                <Route
                  path={routes.personalizedBedtimeStoryGenerator}
                  element={<PersonalizedBedtimeStoryGenerator />}
                />
                <Route
                  path={routes.privacyPolicy}
                  element={<PrivacyPolicyPage />}
                />
                <Route
                  path={routes.termsAndConditions}
                  element={<TermsAndConditionsPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <GenerationProgressChip />
            <CookiePolicy />
          </LocaleProvider>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
