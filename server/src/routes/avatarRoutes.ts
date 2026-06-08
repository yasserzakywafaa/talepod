import AvatarsController from "../controllers/AvatarsController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const avatarRouter = Router();

// All avatar routes are user-scoped and require authentication.
avatarRouter.get(
  END_POINTS.AVATARS.LIST,
  authMiddleware,
  AvatarsController.listAvatars,
);
avatarRouter.post(
  END_POINTS.AVATARS.CREATE,
  authMiddleware,
  AvatarsController.createAvatar,
);
avatarRouter.get(
  END_POINTS.AVATARS.GET,
  authMiddleware,
  AvatarsController.getAvatar,
);
avatarRouter.put(
  END_POINTS.AVATARS.UPDATE,
  authMiddleware,
  AvatarsController.updateAvatar,
);
avatarRouter.delete(
  END_POINTS.AVATARS.DELETE,
  authMiddleware,
  AvatarsController.deleteAvatar,
);

export default avatarRouter;
