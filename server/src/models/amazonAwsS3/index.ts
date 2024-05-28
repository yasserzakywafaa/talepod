import AWS, { S3 } from "aws-sdk";

import CONFIG from "../../config";
import fs from "fs";

// Hosting
AWS.config.update({
  accessKeyId: CONFIG.AWS_ACCESS_KEY,
  secretAccessKey: CONFIG.AWS_SECRET_KEY,
  region: CONFIG.AWS_REGION,
});

const amazonS3 = new AWS.S3();

const uploadFileToS3 = async (
  fileName: string,
  filePath: string
): Promise<string> => {
  // Upload Audio file to AWS S3
  const fileContent = fs.readFileSync(filePath);

  const params: S3.Types.PutObjectRequest = {
    Body: fileContent,
    Bucket: CONFIG.AWS_S3_BUCKET_NAME,
    Key: `${CONFIG.SERVER_TEXT_TO_SPEECH_PATH}/${fileName}`,
    ContentType: "audio/mp3",
  };

  try {
    const response = await amazonS3.upload(params).promise();
    console.log("amazonS3 model:>>> File uploaded successfully", {
      response,
    });

    return response.Location;
  } catch (error) {
    if (error) {
      console.error("amazonS3 model:>>> ERROR", {
        err: error,
      });

      throw error;
    }
  }

  return "";
};

export { uploadFileToS3 };
