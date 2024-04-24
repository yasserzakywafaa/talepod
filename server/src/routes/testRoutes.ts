import END_POINTS from "../models/endpoints";
import TestController from "../controllers/TestController";
import express from "express";

const testRouter = express.Router();

// Define API routes
testRouter.post(
  END_POINTS.TESTING.ROUTE_1,
  TestController.testRoutOne
);
testRouter.post(
  END_POINTS.TESTING.ROUTE_2,
  TestController.testRoutTwo
);

export default testRouter;
