import DashboardController from "../controllers/DashboardController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const dashboardRoutes = Router();

// Define API routes
dashboardRoutes.get(
  END_POINTS.DASHBOARD.OVERVIEW.GET_USERS_COUNT,
  DashboardController.getUsersCount
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.OVERVIEW.GET_STORIES_COUNT,
  DashboardController.getStoriesCount
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_ALL_USERS,
  DashboardController.getAllUsers
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(":userId"),
  DashboardController.getUserById
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_USER_STORIES_COUNT(":userId"),
  DashboardController.getUserStoriesCount
);

dashboardRoutes.put(
  END_POINTS.DASHBOARD.USERS.UPDATE_USER_ROLE(":userId"),
  DashboardController.updateUserRole
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.USERS.BLOCK_USER(":userId"),
  DashboardController.blockUser
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.USERS.DELETE_USER(":userId"),
  DashboardController.deleteUser
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.STORIES.GET_ALL_STORIES,
  DashboardController.getAllStories
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.STORIES.DELETE_STORY(":storyId"),
  DashboardController.deleteStory
);

export default dashboardRoutes;
