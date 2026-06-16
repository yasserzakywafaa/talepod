import END_POINTS from "../models/endpoints";
import OpenAIController from "../controllers/OpenAIController";
import { Router } from "express";

const createRouter = Router();

const mountCreate = (pathStory: string, pathSeo: string, pathAudio: string, pathImages: string, pathBlog: string) => {
  createRouter.post(pathStory, OpenAIController.createStory);
  createRouter.post(pathSeo, OpenAIController.createStorySeo);
  createRouter.post(pathAudio, OpenAIController.createStoryAudio);
  createRouter.post(pathImages, OpenAIController.createImages);
  createRouter.post(pathBlog, OpenAIController.createBlog);
};

mountCreate(
  END_POINTS.CREATE.STORY,
  END_POINTS.CREATE.STORY_SEO,
  END_POINTS.CREATE.STORY_AUDIO,
  END_POINTS.CREATE.IMAGES,
  END_POINTS.CREATE.BLOG,
);

// Lightweight status poll for the docked generation chip (GET, keyed by id).
createRouter.get(
  END_POINTS.CREATE.STORY_STATUS(":storyId"),
  OpenAIController.getStoryGenerationStatus,
);

mountCreate(
  END_POINTS.LEGACY_OPENAI.STORY,
  END_POINTS.LEGACY_OPENAI.STORY_SEO,
  END_POINTS.LEGACY_OPENAI.STORY_AUDIO,
  END_POINTS.LEGACY_OPENAI.IMAGES,
  END_POINTS.LEGACY_OPENAI.BLOG,
);

export default createRouter;
