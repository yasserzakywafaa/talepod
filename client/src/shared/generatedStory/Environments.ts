export interface Environment {
  name: string;
  value: string;
  description?: string;
}

export const Environments: Environment[] = [
  {
    name: "Enchanted Forest",
    value: "EF",
    description:
      "A magical woodland filled with mystical creatures and hidden secrets.",
  },
  {
    name: "Desert Oasis",
    value: "DO",
    description: "A lush, vibrant spot in the middle of a vast, sandy desert.",
  },
  {
    name: "Snowy Mountain",
    value: "SM",
    description:
      "A majestic, snow-covered peak with icy caves and adventurous slopes.",
  },
  {
    name: "Underwater Kingdom",
    value: "UK",
    description:
      "A colorful, vibrant world beneath the sea, with friendly sea creatures and hidden treasures.",
  },
  {
    name: "Fairy Meadow",
    value: "FM",
    description:
      "A bright, flower-filled meadow where fairies and other magical beings live.",
  },
  {
    name: "Mystical Cave",
    value: "MC",
    description:
      "A dark, mysterious cave with glowing crystals and ancient secrets.",
  },
  {
    name: "Sunny Beach",
    value: "SB",
    description: "A warm, sandy beach with gentle waves and hidden coves.",
  },
  {
    name: "Magical Garden",
    value: "MG",
    description:
      "A beautiful, ever-blooming garden with talking plants and magical fountains.",
  },
  {
    name: "Ancient Castle",
    value: "AC",
    description:
      "A grand, ancient castle filled with secret passages, towers, and hidden rooms.",
  },
  {
    name: "Floating Island",
    value: "FI",
    description:
      "A mystical, floating island in the sky with breathtaking views and magical creatures.",
  },
];
