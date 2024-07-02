import "./LoaderSpinner.scss";

// import loaderGIF from "../../../assets/images/loader.gif";
import { CircularProgress } from "@mui/material";

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
      <CircularProgress color="primary" />
      {/* <img src={loaderGIF} alt="Loader Spinner" className="loader-image" /> */}
    </div>
  );
};

export default LoaderSpinner;
