import "../assets/scss/App.scss";
import "../assets/scss/fonts.scss";
import "../assets/scss/default.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { FC, Suspense, lazy, useEffect } from "react";

import { AppWithGoogleAuth } from "../components/SocialLogins/GoogleAuth/store/Provider";
import { ApplicationContextProvider } from "./store/Provider";
import LandingPage from "src/Pages/Landing/Landing";
import LoaderSpinner from "../components/shared/Loading/LoaderSpinner";
import NotFoundPage from "src/Pages/NotFound/NotFound";
import Register from "src/components/Modals/RegisterModal/Register";
import routes from "./routes";
import useApplicationStore from "./store/store";

// import { DBUtils } from "./lib/database";
// import "./shared/components/TinyMCE";
// import { PouchDBIndexesEnum } from "./shared/enums";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const CheckoutPage = lazy(() => import("../Pages/Checkout/CheckoutPage"));
const UnauthorizedPage = lazy(
  () => import("../Pages/Unauthorized/Unauthorized")
);

const App: FC = () => {
  // const {
  //   store: { state },
  // } = useApplicationContext();
  const { state } = useApplicationStore();
  const defaultTheme = createTheme({
    palette: { mode: state.themeMode },
  });

  useEffect(() => {
    console.log("App:>>> themeMode", state.themeMode);
  }, [state]);

  // /**
  //  * Create database
  //  */
  // useEffect(
  //   () => {
  //     DBUtils.createLocalPouchDB().then(async (database) => {
  //       await DBUtils.createDBIndexesIfNotExist(
  //         Object.values(PouchDBIndexesEnum)
  //       );

  //       // // Fetch All Data from PouchDB
  //       // .then(() => dispatch(SettingsActions.fetchDataFromDB()))
  //       // .catch((error) => {
  //       //   console.error(`❌ Error Getting Document:>>>`, error);
  //       //   throw error;
  //       // });
  //     });
  //   },
  //   [
  //     // dispatch
  //   ]
  // );

  return (
    <AppWithGoogleAuth>
      <ApplicationContextProvider>
        <Suspense fallback={<LoaderSpinner />}>
          <ThemeProvider theme={defaultTheme}>
            <CssBaseline />

            <BrowserRouter>
              <Routes>
                <Route path={routes.register} element={<Register />} />

                <Route index path={routes.home} element={<HomePage />} />

                <Route index path={routes.landing} element={<LandingPage />} />

                <Route path={routes.checkout} element={<CheckoutPage />} />

                <Route
                  path={routes.unauthorized}
                  element={<UnauthorizedPage />}
                />

                {/* Fallback route for 404 errors */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </Suspense>
      </ApplicationContextProvider>
    </AppWithGoogleAuth>
  );
};

export default App;
