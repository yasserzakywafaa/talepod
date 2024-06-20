import "./LoaderSpinner.scss";

import loaderGIF from "../../../assets/images/loader.gif";

// import { CircularProgress } from "@material-ui/core";

interface LoaderSpinnerProps {
  style?: React.CSSProperties;
}
const LoaderSpinner = (props: LoaderSpinnerProps) => {
  const { style } = props;

  return (
    <div
      style={style}
      className="loader-spinner-wrapper flex justify--center align--center"
    >
      {/* <CircularProgress disableShrink style={{ color: "#FFF" }} /> */}
      <img src={loaderGIF} alt="Loader Spinner" className="loader-image" />
    </div>
  );
};

export default LoaderSpinner;
