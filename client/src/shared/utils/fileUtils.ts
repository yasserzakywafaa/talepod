import { Attachment } from "src/shared/interfaces";
import axios from "axios";

/**
 * Convert Base64 to File
 */
export const convertBase64ToDataURL = (attachment: Attachment): string => {
  const dataURL = `data:${attachment.content_type};base64,${attachment.data}`;
  return dataURL;
};

/**
 * Get file data from Blob
 */
export const convertBlobStringToDataUrl = (
  fileBlob: Blob,
  fileName?: string
) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);

      const blobObject = new Blob([fileBlob], { type: "video/mp4" });
      // reader.readAsArrayBuffer(blobObject);

      reader.readAsDataURL(blobObject);

      // reader.readAsBinaryString(blobObject);

      // reader.readAsText(blobObject);

      // const revokedURL = URL.revokeObjectURL(fileBlob);
      // debugger;
      // resolve(revokedURL);

      // if (fileBlob) reader.readAsDataURL(fileBlob);
      // else throw new Error();

      // const newFile = new File([fileBlob], fileName);
      // resolve(newFile);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Convert .zip file to DataURL/Blob
 */
export const convertZipFileToDataUrl = (zipFile: File) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);

      if (zipFile) reader.readAsDataURL(zipFile);
      else throw new Error();
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Convert .zip Data URL to file
 */
export const convertDataUrlToZipFile = (zipDataURL: any, fileName: string) => {
  return new Promise((resolve, reject) => {
    try {
      const arr = zipDataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      if (zipDataURL && fileName) {
        resolve(new File([u8arr], fileName, { type: mime }));
      } else {
        throw new Error();
      }
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Upload file and save it to device
 */
export const uploadFileToDevice = async (
  uploadOptions: any,
  callback: Function
) => {
  // API Request
  await axios
    .request(uploadOptions)
    .then((response) => {
      callback({
        response,
        hasError: false,
      });
    })
    .catch((error) => {
      callback({
        error,
        hasError: true,
      });
    });
};

/**
 * Delete file from device
 */
export const deleteFileFromDevice = async (
  deleteOptions: any,
  callback: Function
) => {
  // API Request
  await axios
    .request(deleteOptions)
    .then((response) => {
      callback({
        response,
        hasError: false,
      });
    })
    .catch((error) => {
      callback({
        error,
        hasError: true,
      });
    });
};

/**
 * Rename File
 */
export const renameFile = (originalFile: File, newName: string) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};
