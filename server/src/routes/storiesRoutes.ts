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

storiesRouter.get(
  END_POINTS.STORIES.GET_ORIGINAL_STORIES,
  StoriesController.getOriginalStories
);

storiesRouter.get(
  END_POINTS.STORIES.GET_USERS_STORIES,
  StoriesController.getAllUsersStories
);

export default storiesRouter;
