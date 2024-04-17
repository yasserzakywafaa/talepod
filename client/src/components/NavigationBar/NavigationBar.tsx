import classNames from "classnames";
import { useNavigate } from "react-router-dom";

import "./NavigationBar.scss";
import Logo from "./Logo";
import BackButton from "./BackButton";
import RefreshButton from "./RefreshButton";
import NetworkStatus from "./NetworkStatus";
import { PlayerModeEnum } from "src/shared/enums";

interface NavigationBarProps {
  path?: string;
  className?: string;
  showBackButton?: boolean;
  changeMode?: (mode: PlayerModeEnum) => void;
}

const NavigationBar = (props: NavigationBarProps) => {
  const { path, showBackButton } = props;
  const navigate = useNavigate();
  const navigatioBarClassNames = classNames({
    "navigation-bar": true,
  });

  const handleOnBackClick = () => navigate(path);
  const handleOnRefreshClick = () => window.location.reload();

  return (
    <div className={navigatioBarClassNames}>
      <div className="navigation-bar-container">
        <div className="navigation-bar-logo" onClick={handleOnBackClick}>
          <Logo />
        </div>

        <div className="navigation-bar-actions">
          {showBackButton && <BackButton onClick={handleOnBackClick} />}

          <RefreshButton onClick={handleOnRefreshClick} />

          <NetworkStatus />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
