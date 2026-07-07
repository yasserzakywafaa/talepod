import { Box } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";

import Elephant from "../../../assets/images/happy_elephant_with_water_bottle.webp";
import Fox from "../../../assets/images/dreaming_fox_with_a_pillow.webp";
import Giraffe from "../../../assets/images/dreaming_giraffe_with_a_pillow.webp";
import Penguin from "../../../assets/images/cute_penguin_with_a_fish.webp";
import Puppy from "../../../assets/images/cute_puppy_with_sparkling_eyes.webp";

export interface RandomImageProps {
  style?: CSSProperties;
}

const images = [Puppy, Penguin, Elephant, Fox, Giraffe];

const shuffleImages = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const RandomImage = (props: RandomImageProps) => {
  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    setRandomImage(shuffleImages(images));
  }, []);

  if (!randomImage) {
    return (
      <Box
        sx={{ width: "100%", height: "100%" }}
        style={props.style}
      />
    );
  }

  return (
    <img
      src={randomImage}
      alt={`Random Image`}
      width="100%"
      height="100%"
      style={props.style}
    />
  );
};

export default RandomImage;
