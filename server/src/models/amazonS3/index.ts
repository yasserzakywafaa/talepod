import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import CONFIG from "../../config";
import fs from "fs";

// Create an S3 client
const s3Client = new S3Client({
  region: CONFIG.HOST_AWS_REGION,
  credentials: {
    accessKeyId: CONFIG.HOST_AWS_ACCESS_KEY,
    secretAccessKey: CONFIG.HOST_AWS_SECRET_KEY,
  },
});

const uploadFileToS3 = async (
  fileName: string,
  filePath: string
): Promise<string> => {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath);

    // Create a command to put object to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: CONFIG.HOST_AWS_S3_BUCKET_NAME,
      Key: `${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}/${fileName}`,
      Body: fileContent,
      ContentType: "audio/mp3",
    });

    // Execute the command
    await s3Client.send(putObjectCommand);

    // Return the URL of the uploaded file
    return `https://${CONFIG.HOST_AWS_S3_BUCKET_NAME}.s3.${CONFIG.HOST_AWS_REGION}.amazonaws.com/${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}/${fileName}`;
  } catch (error) {
    console.error("amazonS3 model:>>> ERROR", {
      error,
    });

    throw error;
  }
};

export { uploadFileToS3 };
