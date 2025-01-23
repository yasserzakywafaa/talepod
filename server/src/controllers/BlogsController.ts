import { DocumentWithId, PageResponse } from "..//models/types";
import { NextFunction, Request, Response } from "express";
import { handleGetAllBlogs, handleGetBlogBySlug } from "../services/fetch/blog";

export const getAllBlogs = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction
) => {
  try {
    const parsedPagingInfo = JSON.parse(
      (request.query.pagingInfo as string) || "{}"
    );

    const { results, paging } = await handleGetAllBlogs(parsedPagingInfo);

    response.status(200).json({
      results,
      paging,
    });
  } catch (error) {
    console.error("❌ Failed to get all blogs!", {
      error,
    });
    return undefined;
  }
};

export const getBlogBySlug = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const blogSlug = request.params.slug;

  try {
    const blog = await handleGetBlogBySlug(blogSlug);

    response.status(200).json(blog);
  } catch (error) {
    console.error({ message: error });
    next(error);
  }
};

const BlogsController = {
  getAllBlogs,
  getBlogBySlug,
};

export default BlogsController;
