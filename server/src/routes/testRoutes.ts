import END_POINTS from "../models/endpoints";
import TestController from "../controllers/TestController";
import express from "express";

const testRouter = express.Router();

// Define API routes
testRouter.post(
  END_POINTS.TESTING.ROUTE_ONE,
  TestController.testRoutOne
);
testRouter.post(
  END_POINTS.TESTING.ROUTE_TWO,
  TestController.testRoutTwo
);

export default testRouter;
