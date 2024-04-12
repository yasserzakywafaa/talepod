import axios from "axios";

import {
  Attachment,
  ConvertedFileTypes,
  Document,
} from "src/shared/interfaces";

/**
 * Check image orientation
 */

//  export const checkImageOrientation = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
export const checkImageOrientation = (event: any) => {
  const { naturalHeight, naturalWidth } = event.target;
  event.target.setAttribute(
    "data-portrait",
    Number(naturalHeight > naturalWidth)
  );
};

/**
 * Get available space size
 */
export const getAvailableSpace = (element: Element) => {
  const style = window.getComputedStyle(element, null),
    calc = (property: string) =>
      style
        .getPropertyValue(property)
        .split(/\D+/g)
        .map((num) => Number(num));

  const [pt, pr, pb, pl] = calc("padding"),
    [height] = calc("height"),
    [width] = calc("width");

  return {
    width: width - (pl + pr) * 2,
    height: height - pt - pb,
  };
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 8, prefix = "") => {
  let str = "";

  while (str.length <= length) {
    const [character] = Math.random().toString(36).substr(2),
      isTrue = Math.floor(Math.random() * 2) === 0;

    str += character[isTrue ? "toLowerCase" : "toUpperCase"]();
  }

  return `${prefix}_${str}`;
};

/**
 * Convert file to Data Base64
 */
export const convertFileToURLAndBase64 = (
  file: File
): Promise<ConvertedFileTypes> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.toString().replace(/^data:(.*,)?/, "");
        return resolve({
          dataURL: reader.result as string,
          base64,
        });
      };

      if (file) reader.readAsDataURL(file);
      else throw new Error();
    } catch (e) {
      reject(e);
    }
  });
};

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
 * Sort Docs Cards by order
 */
export const sortCardsByDocsOrder = (docsArray: Document[]): Document[] => {
  if (!docsArray.length) return [];

  const orders = docsArray.map((doc) => {
    return {
      id: doc._id,
      order: doc.data.order,
    };
  });
  const sortedValues = orders.sort((a, b) => (a.order > b.order ? 1 : -1));
  const mappedSortedContent = sortedValues.map((card, index) => {
    const currentDoc: Document = docsArray.find((d) => d._id === card.id);
    return {
      ...currentDoc,
      data: {
        ...currentDoc.data,
        order: index,
      },
    };
  });

  return mappedSortedContent;
};

/**
 * Get query params
 */
export const getQueryParams = (params: string) => {
  return String(params)
    .split(/\?|&/g)
    .filter((str) => str)
    .map((str) => {
      const [key, value] = str.split("=");
      return { [key]: value };
    })
    .reduce((p, n) => ({ ...p, ...n }), {});
};

/**
 * Get query params
 */
export const makeURL = (location: any = {}, queries = {}) => {
  const { pathname } = location;

  const newSearch = Object.keys(queries)
    .map(
      (key, i) =>
        `${i === 0 ? "?" : ""}${key}=${window.encodeURIComponent(queries[key])}`
    )
    .join("&");

  return pathname + newSearch;
};

/**
 * Set attributes to an element
 */
export const setAttributesToElement = (element: any = {}, attributes = {}) => {
  Object.keys(attributes).forEach((attr) => {
    element.setAttribute(attr, attributes[attr]);
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
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
  return string.split(" ").join("-");
};

/**
 * Convert bytes into Megabytes
 */
export const convertToMB = (bytes: number) => (bytes / 1000000).toFixed(0);

/**
 * Rename File
 */
export const renameFile = (originalFile: File, newName: string) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};
