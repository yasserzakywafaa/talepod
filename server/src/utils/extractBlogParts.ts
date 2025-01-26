import { BlogParts } from "../models/types";

// Function to extract the parts of the blog
const extractBlogParts = (blog: string): BlogParts => {
  console.log("🛠️  Extracting Blog Parts 🛠️");

  const parts = blog.match(/{([^}]*)}/g);

  if (parts && parts.length === 5) {
    return {
      title: parts[0].replace(/{|}/g, ""),
      introduction: parts[1].replace(/{|}/g, ""),
      mainBlog: parts[2].replace(/{|}/g, ""),
      conclusion: parts[3].replace(/{|}/g, ""),
      callToAction: parts[4].replace(/{|}/g, ""),
    };
  } else {
    throw new Error("❌ The blog does not contain the correct structure!");
  }
};

export default extractBlogParts;
