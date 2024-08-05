import "./LoaderSpinner.scss";

import { CircularProgress } from "@mui/material";
// import loaderGIF from "../../../assets/images/loader.gif";
// import PingPongLoaderGIF from "../../../assets/images/pingpong_loader.gif";
// import SpinningHeadGIF from "../../../assets/images/spinning_head.gif";
import SplittingRectangle from "./features/SplittingRectangle/SplittingRectangle";

export enum LoaderComponentNameEnum {
  BedtimeStory = "BedtimeStory",
  BedtimeStories = "BedtimeStories",
  CreateAudio = "CreateAudio",
  CreateStory = "CreateStory",
}

interface LoaderSpinnerProps {
  style?: React.CSSProperties;
  loaderComponentName?: string;
}
const LoaderSpinner = (props: LoaderSpinnerProps) => {
  const { style, loaderComponentName } = props;
  // const isCreatingAudio =
  //   loaderComponentName === LoaderComponentNameEnum.CreateAudio;

  return (
    <div
      style={style}
      className="loader-spinner-wrapper flex justify--center align--center"
    >
      {/* <img
        src={SpinningHeadGIF}
        alt="Loader Spinner"
        className="loader-image"
      /> */}

      {loaderComponentName ? (
        <SplittingRectangle text={loaderComponentName} />
      ) : (
        <CircularProgress color="primary" />
      )}
    </div>
  );
};

export default LoaderSpinner;
