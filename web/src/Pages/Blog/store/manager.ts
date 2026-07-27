import axios, { AxiosResponse } from "axios";

import { Blog } from "./state";
import { BlogStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { getAxiosError } from "src/shared/utils/getAxiosError";

export interface BlogManager {
  setUp: (slug: string) => void;
  fetchBlogBySlug: (slug: string) => Promise<Blog | undefined>;
}

export const useBlogManager = (store: BlogStore): BlogManager => {
  const setUp = async (slug: string) => {
    store.setIsFetching(true);
    try {
      await fetchBlogBySlug(slug);
      // const story = await fetchStoryBySlug(slug);
      // if (story && !story.seo) {
      // const storySeoPrompt = getStorySeoPrompt(story);
      // await createSeoTextForStory(story, storySeoPrompt);
      // }
    } catch (error) {
      getAxiosError(error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const fetchBlogBySlug = async (slug: string): Promise<Blog | undefined> => {
    try {
      const response: AxiosResponse<Blog, Blog> = await axios.get(
        END_POINTS.BLOGS.GET_BLOG_BY_SLUG(slug)
      );
      store.updateBlog(response.data);

      return response.data;
    } catch (error) {
      store.updateBlog(undefined);
      // throw new Error(`❌ Failed to get Story by Slug :>>> ${error}`);
      console.error("❌ Failed to get Story by Slug :>>>", {
        error,
      });

      return;
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    fetchBlogBySlug,
  };
};
