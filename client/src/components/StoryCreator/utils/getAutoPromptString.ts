import { ChildInfo } from "../domain/state";

export const getAutoTextGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, hairColor, eyeColor, height, nationality } =
    childInfo;

  const fullDynamicPrompt = `Create a story for 1 page children's book that has around 200 characters per page, for a ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}cm, and from a country of ${nationality.name}`;

  return fullDynamicPrompt;
};

export const getAutoImageGenPromptString = (childInfo: ChildInfo): string => {
  const { name, gender, age, hairColor, eyeColor, height, nationality } =
    childInfo;

  const fullDynamicPrompt = `A ${age} years old ${gender} named ${name}, with physical characteristics, like the ${gender}'s hair color is ${hairColor}, ${eyeColor} eye color, height of ${height}cm, and from a country of ${nationality.name}`;

  // const longPrmpt = `Create images children's book that will be converted to pdf to go be printed as small square 196mmx196mm children book.
  // Character descriptions for character referencing. Use those characters if needed for each image:
  // The father gabriel: appears to be in his late 30s to early 40s. He has a lean build and is about 6 feet tall, with a weight that seems proportionate to his height. His hairstyle is short, casual, and slightly tousled, with a sandy brown color that has natural highlights. His eyes are a soft blue, and his eyes' shape is a relaxed almond. He has a straight, medium-sized nose and full lips. His face shape is an elongated oval, and his skin tone is fair with a slight tan. He sports a short, well-groomed beard that matches the color of his hair.

  // The mother Julia appears to be in her mid to late 30s. She is about 5 feet 7 inches tall with a slender build, suggesting a weight that is proportionate to her height. She has long, wavy hair, light brown in color with subtle blonde highlights, and it is styled to cascade over her shoulders. Her eyes are a vibrant green, with a round shape that gives her a friendly appearance. She has a small, straight nose and thin lips. Her face shape is a heart, and her skin tone is fair with a natural, healthy glow.

  // The daughter or sister aura: This little girl has a joyful and curious expression, with sparkling eyes and a friendly smile that lights up her face. She has light reddish-blonde hair and fair skin, and her round cheeks suggest the plumpness typical of healthy infancy. Her eyes are a striking shade, clear and bright, and they're wide open with what looks like delight or fascination. The little wooden and colorful bead toy she’s holding adds an extra touch of childlike charm to the image.

  // The son and main character: The baby aged 1 months at the moment has curly blonde hair, big blue eyes, and a cute, rounded face with rosy cheeks. The expression is joyful and innocent, with a small, open-mouthed smile that conveys delight and friendliness. The illustration is detailed with soft shading and textures that give a gentle and approachable feel to the character.
  // Book images style:

  // Digital Painting: The images appear to be digitally painted, a modern technique that mimics traditional painting methods but uses digital tools and software.
  // Realistic with Whimsical Twists: While the overall look is realistic, especially in the rendering of the Zurich landscape and human figures, whimsical touches are added to the scenery and the proportions, giving a magical storybook quality.
  // Rich in Detail: The artwork is meticulous with attention to detail, from the individual leaves and blossoms on the trees to the intricate designs on the traditional clothing and room decorations, enhancing the visual storytelling.
  // Warm and Soft Lighting: The use of light and shadows gives the images a soft, warm glow, contributing to a comforting and nurturing ambiance.
  // Bright and Joyful Palette: The colors are chosen for their brightness and purity, creating a joyful and engaging scene that is appealing to children.
  // Textural Depth: Textures in the artwork are carefully crafted to give depth and dimension, such as the fluffiness of the blanket or the grain of the wooden bench, inviting touch and exploration.
  // Cultural Representation: The inclusion of traditional German-Polish clothing and decor elements speaks to the cultural heritage of the characters, providing educational value and context.`;

  return fullDynamicPrompt;
};
