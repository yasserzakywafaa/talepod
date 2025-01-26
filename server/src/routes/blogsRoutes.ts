import BlogsController from "../controllers/BlogsController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const blogsRouter = Router();

// Define API routes
blogsRouter.get(END_POINTS.BLOGS.GET_ALL_BLOGS, BlogsController.getAllBlogs);

blogsRouter.get(
  END_POINTS.BLOGS.GET_BLOG_BY_SLUG(":slug"),
  BlogsController.getBlogBySlug
);

export default blogsRouter;
