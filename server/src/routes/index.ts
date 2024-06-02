import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Automatically import all route files
const routeFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith("Routes.ts"));

routeFiles.forEach((file) => {
  const route = require(path.join(__dirname, file)).default;
  router.use(route);
});

export default router;
