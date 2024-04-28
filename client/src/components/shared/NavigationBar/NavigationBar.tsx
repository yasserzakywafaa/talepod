import "./NavigationBar.scss";

// import BackButton from "./BackButton";
// import Logo from "./Logo";
import { PlayerModeEnum } from "src/shared/enums";
// import NetworkStatus from "./NetworkStatus";
// import RefreshButton from "./RefreshButton";
import ToggleColorMode from "../ToggleColorMode";
import classNames from "classnames";
import { useApplicationContext } from "src/application/domain/Provider";

// import { useNavigate } from "react-router-dom";

interface NavigationBarProps {
  path?: string;
  className?: string;
  showBackButton?: boolean;
  changeMode?: (mode: PlayerModeEnum) => void;
}

const NavigationBar = (props: NavigationBarProps) => {
  // const { path = "", showBackButton = false } = props;
  // const navigate = useNavigate();
  const navigatioBarClassNames = classNames({
    "navigation-bar": true,
  });

  const {
    store: {
      state: { themeMode },
      toggleThemeMode,
    },
  } = useApplicationContext();

  // const handleOnBackClick = () => navigate(path);
  // const handleOnRefreshClick = () => window.location.reload();

  return (
    <div className={navigatioBarClassNames}>
      <div className="navigation-bar-container">
        {/* <div className="navigation-bar-logo" onClick={handleOnBackClick}> */}
        <div className="navigation-bar-logo">{/* <Logo /> */}</div>

        <div className="navigation-bar-actions">
          {/* {showBackButton && <BackButton onClick={handleOnBackClick} />} */}

          <ToggleColorMode mode={themeMode} toggleColorMode={toggleThemeMode} />

          {/* <RefreshButton onClick={handleOnRefreshClick} /> */}
          {/* <NetworkStatus /> */}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
