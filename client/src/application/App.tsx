import "../assets/scss/App.scss";
import "../assets/scss/fonts.scss";
import "../assets/scss/default.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Suspense, lazy } from "react";

import { AppContextProvider } from "./AppContext";
// import { DBUtils } from "./lib/database";
import LoaderSpinner from "../components/Loading/LoaderSpinner";
import routes from "./routes";

// import "./shared/components/TinyMCE";
// import { PouchDBIndexesEnum } from "./shared/enums";

const HomePage = lazy(() => import("../Pages/Home/Home"));
const UnauthorizedPage = lazy(
  () => import("../Pages/Unauthorized/Unauthorized")
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
    <AppContextProvider>
      <Suspense fallback={<LoaderSpinner />}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <BrowserRouter>
            <Routes>
              <Route index path={routes.home} element={<HomePage />} />

              <Route
                path={routes.unauthorized}
                element={<UnauthorizedPage />}
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </Suspense>
    </AppContextProvider>
  );
};

export default App;
