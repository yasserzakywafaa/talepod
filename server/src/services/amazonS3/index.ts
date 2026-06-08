import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import CONFIG from "../../config";
import fs from "fs";

// Create an S3 client
const s3Client = new S3Client({
  region: CONFIG.HOST_AWS_REGION ?? "",
  credentials: {
    accessKeyId: CONFIG.HOST_AWS_ACCESS_KEY ?? "",
    secretAccessKey: CONFIG.HOST_AWS_SECRET_KEY ?? "",
  },
});

interface UploadOptions {
  /** MIME type for the S3 object. Defaults to audio/mp3 (back-compat). */
  contentType?: string;
  /** S3 key prefix (folder). Defaults to the text-to-speech audio path. */
  keyPrefix?: string;
}

const uploadFileToS3 = async (
  fileName: string,
  filePath: string,
  options?: UploadOptions
): Promise<string> => {
  const contentType = options?.contentType ?? "audio/mp3";
  const keyPrefix = options?.keyPrefix ?? CONFIG.SERVER_TEXT_TO_SPEECH_PATH;
  const bucket = CONFIG.IS_DEV
    ? CONFIG.HOST_AWS_S3_BUCKET_NAME_DEV
    : CONFIG.HOST_AWS_S3_BUCKET_NAME_PROD;

  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath);

    // Create a command to put object to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: `${keyPrefix}/${fileName}`,
      Body: fileContent,
      ContentType: contentType,
    });

    // Execute the command
    await s3Client.send(putObjectCommand);

    // Return the URL of the uploaded file
    return `https://${bucket}.s3.${CONFIG.HOST_AWS_REGION}.amazonaws.com/${keyPrefix}/${fileName}`;
  } catch (error) {
    throw new Error("❌ Failed to upload file to AmazonS3!", {
      cause: error,
    });
  }
};

export { uploadFileToS3 };
