import "./SplittingRectangle.scss";

import { LoaderComponentNameEnum } from "../../LoaderSpinner";

export interface SplittingRectangleProps {
  text?: string;
}

const SplittingRectangle = (props: SplittingRectangleProps) => {
  const getSplittingRectangleText = (): string => {
    switch (props.text) {
      case LoaderComponentNameEnum.BedtimeStories:
        return "Obtaining Bedtime Stories";

      case LoaderComponentNameEnum.BedtimeStory:
        return "Acquiring Magic";

      case LoaderComponentNameEnum.CreateAudio:
        return "Enchanting Audio";

      case LoaderComponentNameEnum.CreateStory:
        return "Crafting Magical Bedtime Story";

      default:
        return "";
    }
  };

  return (
    <>
      <div className="splitting-rectangle-loader">
        {getSplittingRectangleText() || "Crafting Magic"}
      </div>
    </>
  );
};

export default SplittingRectangle;
