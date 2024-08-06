import "./SplittingRectangle.scss";

import { useEffect, useState } from "react";

import { LoaderComponentNameEnum } from "../../LoaderSpinner";

export interface SplittingRectangleProps {
  text?: string;
}

const SplittingRectangle = (props: SplittingRectangleProps) => {
  const [audioText, setAudioText] = useState<string>("Enchanting Audio");
  const possibleAudioTexts = [
    "Enchanting Audio",
    "Creating Melody",
    "Composing Sound",
    "Generating Tunes",
  ];

  const getSplittingRectangleText = (): string => {
    switch (props.text) {
      case LoaderComponentNameEnum.BedtimeStories:
        return "Obtaining Stories";

      case LoaderComponentNameEnum.BedtimeStory:
        return "Acquiring Magic";

      case LoaderComponentNameEnum.CreateAudio:
        return audioText;

      case LoaderComponentNameEnum.CreateStory:
        return "Crafting Magical Bedtime Story";

      default:
        return "";
    }
  };

  useEffect(() => {
    if (props.text === LoaderComponentNameEnum.CreateAudio) {
      const intervalId = setInterval(() => {
        setAudioText((prevText) => {
          const currentIndex = possibleAudioTexts.indexOf(prevText);
          const nextIndex = (currentIndex + 1) % possibleAudioTexts.length;
          return possibleAudioTexts[nextIndex];
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return;
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
