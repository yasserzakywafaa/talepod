import { useEffect, useState } from "react";

import Elephant from "../../../assets/images/happy_elephant_with_water_bottle.webp";
import Fox from "../../../assets/images/dreaming_fox_with_a_pillow.webp";
import Giraffe from "../../../assets/images/dreaming_giraffe_with_a_pillow.webp";
import Penguin from "../../../assets/images/cute_penguin_with_a_fish.webp";
import Puppy from "../../../assets/images/cute_puppy_with_sparkling_eyes.webp";

// import Unicorn from "../../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";

const images = [Puppy, Penguin, Elephant, Fox, Giraffe];

const shuffleImages = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const RandomImage: React.FC = () => {
  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    setRandomImage(shuffleImages(images));
  }, []);

  return (
    <div>
      <img src={randomImage} alt={`Random Image`} width="100%" height="100%" />
    </div>
  );
};

export default RandomImage;
