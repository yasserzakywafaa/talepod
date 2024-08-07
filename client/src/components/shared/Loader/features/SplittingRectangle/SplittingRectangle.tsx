import "./SplittingRectangle.scss";

import { possibleAudioLoaders, possibleStoryLoaders } from "./possibleLoaders";
import { useEffect, useState } from "react";

import { LoaderComponentNameEnum } from "../../LoaderSpinner";

export interface SplittingRectangleProps {
  text?: string;
}

const SplittingRectangle = (props: SplittingRectangleProps) => {
  const [createStoryLoader, setCreateStoryLoader] = useState<string>(
    possibleStoryLoaders[0]
  );

  const [audioLoader, setAudioLoader] = useState<string>(
    possibleAudioLoaders[0]
  );

  const handleCreateStoryLoaders = () => {
    if (props.text === LoaderComponentNameEnum.CreateStory) {
      const intervalId = setInterval(() => {
        setCreateStoryLoader((prevText) => {
          const currentIndex = possibleStoryLoaders.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % possibleStoryLoaders.length;
          return possibleStoryLoaders[nextIndex];
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return;
  };

  const handleCreateAudioLoaders = () => {
    if (props.text === LoaderComponentNameEnum.CreateAudio) {
      const intervalId = setInterval(() => {
        setAudioLoader((prevText) => {
          const currentIndex = possibleAudioLoaders.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % possibleAudioLoaders.length;
          return possibleAudioLoaders[nextIndex];
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return;
  };

  const getSplittingRectangleText = (): string => {
    switch (props.text) {
      case LoaderComponentNameEnum.BedtimeStories:
        return "Obtaining Stories";

      case LoaderComponentNameEnum.BedtimeStory:
        return "Acquiring Magic";

      case LoaderComponentNameEnum.CreateAudio:
        return audioLoader;

      case LoaderComponentNameEnum.CreateStory:
        return createStoryLoader;

      default:
        return "";
    }
  };

  useEffect(() => {
    handleCreateAudioLoaders();
    handleCreateStoryLoaders();
  }, [props.text]);

  return (
    <>
      <div className="splitting-rectangle-loader">
        {getSplittingRectangleText() || "Crafting Magic"}
      </div>
    </>
  );
};

export default SplittingRectangle;
