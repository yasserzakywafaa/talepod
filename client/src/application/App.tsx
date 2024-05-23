import "../assets/scss/App.scss";
import "../assets/scss/fonts.scss";
import "../assets/scss/default.scss";

import { FC, Suspense } from "react";

import AppContent from "./AppContent";
import AppProviders from "./AppProviders";
import { AppWithGoogleAuth } from "../components/shared/SocialLogins/GoogleAuth/store/Provider";
import LoaderSpinner from "../components/shared/Loading/LoaderSpinner";

const App: FC = () => {
  return (
    <AppWithGoogleAuth>
      <AppProviders>
        <Suspense fallback={<LoaderSpinner />}>
          <AppContent />
        </Suspense>
      </AppProviders>
    </AppWithGoogleAuth>
  );
};

export default App;
