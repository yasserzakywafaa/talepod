import END_POINTS from "../models/endpoints";
import { Router } from "express";
import StoriesController from "../controllers/StoriesController";

const storiesRouter = Router();

// Define API routes
storiesRouter.get(
  END_POINTS.STORIES.GET_ALL_STORIES,
  StoriesController.getAllStories
);

storiesRouter.get(
  END_POINTS.STORIES.GET_STORY_BY_ID(":slug"),
  StoriesController.getStoryBySlug
);

storiesRouter.get(
  END_POINTS.STORIES.GET_ALL_USER_STORIES,
  StoriesController.getAllUserStories
);

export default storiesRouter;
