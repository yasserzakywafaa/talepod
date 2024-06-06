import END_POINTS from "../models/endpoints";
import { Router } from "express";
import TestController from "../controllers/TestController";

const testRouter = Router();

// Define API routes
testRouter.post(END_POINTS.TESTING.ROUTE_ONE, TestController.testRoutOne);
testRouter.post(END_POINTS.TESTING.ROUTE_TWO, TestController.testRoutTwo);

export default testRouter;
