import END_POINTS from "../models/endpoints";
import { Router } from "express";
import StoriesController from "../controllers/StoriesController";

const blogsRouter = Router();

// Define API routes
blogsRouter.get(
  END_POINTS.BLOGS.GET_ALL_BLOGS,
  StoriesController.getAllStories
);

blogsRouter.get(
  END_POINTS.BLOGS.GET_BLOG_BY_SLUG(":slug"),
  StoriesController.getStoryBySlug
);

export default blogsRouter;
