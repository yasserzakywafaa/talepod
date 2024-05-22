import { ReactComponent as FileLogo } from "../../../assets/images/logo.svg";

import "./Logo.scss";

interface LogoParams {
  class?: string;
}

const Logo = (props: LogoParams) => {
  return (
    <div className={`app-logo ${props.class}`}>
      <FileLogo />
    </div>
  );
};

export default Logo;
