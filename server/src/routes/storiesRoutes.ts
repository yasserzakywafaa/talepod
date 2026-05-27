import END_POINTS from "../models/endpoints";
import { Router } from "express";
import StoriesController from "../controllers/StoriesController";
import { authMiddleware } from "../middleware/authMiddleware";

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

// eBook PDF export (public) + email delivery (authenticated)
storiesRouter.get(
  END_POINTS.STORIES.EXPORT_STORY_PDF(":slug"),
  StoriesController.exportStoryPdf
);

storiesRouter.post(
  END_POINTS.STORIES.EMAIL_STORY_PDF(":slug"),
  authMiddleware,
  StoriesController.emailStoryPdf
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
