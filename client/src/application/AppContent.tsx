import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, createTheme } from "@mui/material";

import NotFoundPage from "../Pages/NotFound/NotFound";
import { ThemeProvider } from "@emotion/react";
import { lazy } from "react";
import routes from "./routes";
import { useApplicationContext } from "./store/Provider";

// import { DBUtils } from "./lib/database";
// import "./shared/components/TinyMCE";
// import { PouchDBIndexesEnum } from "./shared/enums";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const CheckoutPage = lazy(() => import("../Pages/Checkout/CheckoutPage"));
const UnauthorizedPage = lazy(
  () => import("../Pages/Unauthorized/Unauthorized")
);

const AppContent = () => {
  const {
    store: { state },
  } = useApplicationContext();

  const defaultTheme = createTheme({
    palette: { mode: state.themeMode },
  });

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
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route index path={routes.home} element={<HomePage />} />

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
