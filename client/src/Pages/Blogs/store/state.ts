import { Blog } from "src/Pages/Blog/store/state";
import { PagingInfo } from "src/shared/types";

export interface BlogsInitialState {
  isFetching: boolean;
  blogs: Blog[];
  pagingInfo: PagingInfo;
}

export interface BlogsFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getBlogsInitialState = (): BlogsInitialState => {
  return {
    isFetching: false,
    blogs: [],
    pagingInfo: {
      pageNumber: 1,
      pageSize: 20,
    },
  };
};
