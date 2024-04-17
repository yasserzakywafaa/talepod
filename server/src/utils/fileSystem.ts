import fs from "fs";
import path from "path";

export const createDirectory = (filePath, callback) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (error) => {
      if (error) callback(error);
      else {
        callback();
        console.log(`🗂  Directory Created :> '${filePath}'`);
      }
    });
  } else {
    callback();
  }
};

export const deleteDirectory = (filePath, callback) =>
  fs.rm(filePath, { recursive: true }, callback);

export const saveFile = (filePath, fileData, callback) =>
  fs.writeFile(filePath, fileData, { flag: "w" }, callback);

export const deleteFile = (filePath, callback) => fs.unlink(filePath, callback);

export const getAbsolutePath = (relativePath) =>
  path.resolve(`${relativePath}`);

export const readFile = async (relativePath) => {
  return await new Promise<string>((resolve, reject) => {
    fs.readFile(relativePath, "utf8", (error, data) => resolve(data));
  }).then((data: string) => data);
};
