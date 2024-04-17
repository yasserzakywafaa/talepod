import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { routes } from "./routes";
// import { DBUtils } from "./lib/database";
import LoaderSpinner from "./components/Loading/LoaderSpinner";

import "./assets/scss/App.scss";
import "./assets/scss/fonts.scss";
import "./assets/scss/default.scss";
// import "./shared/components/TinyMCE";
// import { PouchDBIndexesEnum } from "./shared/enums";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const HomePage = lazy(() => import("./Pages/Home/Home"));
const UnauthorizedPage = lazy(
  () => import("./Pages/Unauthorized/Unauthorized")
);

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(4, 114, 28, 1)",
    },
  },
});

const App = () => {
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
    <Suspense fallback={<LoaderSpinner />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <BrowserRouter>
          <Routes>
            <Route index path={routes.home} element={<HomePage />} />

            <Route path={routes.unauthorized} element={<UnauthorizedPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
