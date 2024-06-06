import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

import CONFIG from "./config";
import WinstonCloudWatch from "winston-cloudwatch";
import dotenv from "dotenv";
import winston from "winston";

// Load environment variables from .env file
dotenv.config();

// Set up AWS CloudWatch Logs client with credentials
const cloudwatchLogsClient = new CloudWatchLogsClient({
  region: CONFIG.HOST_AWS_REGION,
  credentials: {
    accessKeyId: CONFIG.HOST_AWS_ACCESS_KEY,
    secretAccessKey: CONFIG.HOST_AWS_SECRET_KEY,
  },
});

// Describe Log Groups to test the CloudWatch Logs client
const describeLogGroupsCommand = new DescribeLogGroupsCommand({});
cloudwatchLogsClient
  .send(describeLogGroupsCommand)
  .then((data) => {
    console.log("ℹ️ CloudwatchlLogGroups:>>", data.logGroups);
  })
  .catch((err) => {
    console.log("❌ CloudwatchlLogGroups Error:>>", err);
  });

// Set up Winston logger with CloudWatch transport
const AwsLogger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      logGroupName: "talepod-logs",
      logStreamName: "talepod-log-stream",
      awsRegion: CONFIG.HOST_AWS_REGION,
      awsAccessKeyId: CONFIG.HOST_AWS_ACCESS_KEY,
      awsSecretKey: CONFIG.HOST_AWS_SECRET_KEY,
      messageFormatter: ({ level, message, additionalInfo }) =>
        `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
          additionalInfo || {}
        )}`,
    }).on("error", (error) => {
      console.error("❌ CloudWatch logging error:>>", error);
    }),
  ],
});

export default AwsLogger;
