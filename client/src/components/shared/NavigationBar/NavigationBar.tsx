import "./NavigationBar.scss";

// import BackButton from "./BackButton";
// import NetworkStatus from "./NetworkStatus";
// import RefreshButton from "./RefreshButton";
// import ToggleColorMode from "./ToggleColorMode";
// import { useApplicationContext } from "src/application/domain/Provider";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import classNames from "classnames";
import { Button } from "@mui/material";
import routes from "src/application/routes";
import { useMatch } from "react-router-dom";

interface NavigationBarProps {
  className?: string;
}

const NavigationBar = (props: NavigationBarProps) => {
  const navigate = useNavigate();
  // const {
  //   store: {
  //     state: { themeMode },
  //     toggleThemeMode,
  //   },
  // } = useApplicationContext();

  // const handleOnBackClick = () => navigate(path);
  // const handleOnRefreshClick = () => window.location.reload();

  const pagesMatch = {
    isHomePage: !!useMatch(routes.home),
    isCheckoutPage: !!useMatch(routes.checkout),
  };
  const navigatioBarClassNames = classNames({
    "navigation-bar": true,
  });

  const handleOnClickLogo = () => navigate(routes.home);
  const handleOnClickCheckout = () => navigate(routes.checkout);


  return (
    <div className={navigatioBarClassNames}>
      <div className="navigation-bar-container">
        {/* <div className="navigation-bar-logo" onClick={handleOnBackClick}> */}
        <Button
          type="button"
          title="Home"
          variant="text"
          // href={routes.home}
          className="navigation-bar-logo"
          onClick={handleOnClickLogo}
        >
          <Logo />
        </Button>

        <div className="navigation-bar-actions">
          {/* {showBackButton && <BackButton onClick={handleOnBackClick} />} */}
          {/* <RefreshButton onClick={handleOnRefreshClick} /> */}
          {/* <NetworkStatus /> */}

          {/* <ToggleColorMode mode={themeMode} toggleColorMode={toggleThemeMode} /> */}

          {!pagesMatch.isCheckoutPage && (
            <Button
              type="button"
              variant="text"
              title="test-checkout-button"
              onClick={handleOnClickCheckout}
            >
              Checkout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
