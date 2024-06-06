import AWS from "aws-sdk";
import CONFIG from "./config";
import WinstonCloudWatch from "winston-cloudwatch";
import winston from "winston";

// Set up AWS SDK with your credentials
AWS.config.update({
  accessKeyId: CONFIG.HOST_AWS_ACCESS_KEY,
  secretAccessKey: CONFIG.HOST_AWS_SECRET_KEY,
  region: CONFIG.HOST_AWS_REGION,
});

const AwsLogger = winston.createLogger({
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
    }),
  ],
});

// module.exports = AwsLogger;
export default AwsLogger;
