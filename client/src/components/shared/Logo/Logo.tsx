import "./Logo.scss";

// import { ReactComponent as FileLogo } from "../../../assets/images/logo.svg";
import FileLogo from "../../../assets/images/sleeping_bunny_with_a_moon.png";

interface LogoParams {
  class?: string;
}

const Logo = (props: LogoParams) => {
  return (
    <div className={`app-logo ${props.class}`}>
      {/* <FileLogo /> */}
      <img src={FileLogo} />
    </div>
  );
};

export default Logo;
