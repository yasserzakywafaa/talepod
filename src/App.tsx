import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { endpoints } from "./routes";
import { DBUtils } from "./lib/database";
import LoaderSpinner from "./components/Loading/LoaderSpinner";

import "./assets/scss/App.scss";
import "./assets/scss/fonts.scss";
import "./assets/scss/default.scss";
import { PouchDBIndexesEnum } from "./shared/enums";
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
  typography: {
    h3: {
      color: "#fff",
    },
    subtitle2: {
      color: "#fff",
    },
    body1: {
      color: "#fff",
    },
  },
});

const App = () => {
  // const dispatch = useDispatch();

  /**
   * Create database
   */
  useEffect(
    () => {
      DBUtils.createLocalPouchDB().then(async (database) => {
        await DBUtils.createDBIndexesIfNotExist(
          Object.values(PouchDBIndexesEnum)
        );

        // // Fetch All Data from PouchDB
        // .then(() => dispatch(SettingsActions.fetchDataFromDB()))
        // .catch((error) => {
        //   console.error(`❌ Error Getting Document:>>>`, error);
        //   throw error;
        // });
      });
    },
    [
      // dispatch
    ]
  );

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename="/">
          <Switch>
            <Route
              exact
              strict
              path={endpoints.unauthorized}
              render={() => <UnauthorizedPage />}
            />
            <Route
              exact
              strict
              path={endpoints.home}
              render={() => <HomePage />}
            />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
