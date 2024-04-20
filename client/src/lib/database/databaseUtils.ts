import { Notify, ToastTypes } from "src/components/Notification/Notification";
import {
  PouchDBAllDocsOptions,
  PouchDBDocParams,
  PouchDBList,
  TypeDatabase,
} from "./databaseConfig";

import { Document } from "src/shared/interfaces";

export const createLocalPouchDB = async () => PouchDBList.localDB;

export const createRemotePouchDB = () => PouchDBList.remoteDB;

/**
 * Add a Doc to DB
 */
export const addOrUpdateDocToDB = async (
  doc: Document,
  // indexes: string[] = [],
  database: TypeDatabase = PouchDBList.localDB
) => {
  return await database
    .put(doc)
    .then((response) => {
      console.log(`💾 Document "${response.id}" saved successfully!`, doc);
      Notify({
        type: ToastTypes.Success,
        content: "Document locally saved successfully!",
      });
      return response;
    })
    .catch((error) => {
      console.error(`❌ Error while Add/Update Document:>>>`, error);
      Notify({
        type: ToastTypes.Error,
        content: "Error while Add/Update Document!",
      });
      throw error;
    });
};

/**
 * Add Bulk Docs to DB
 */
export const addOrUpdateBulkDocsToDB = async (
  docs: Document[],
  database: TypeDatabase = PouchDBList.localDB
) => {
  return await database
    .bulkDocs(docs)
    .then((response) => {
      console.log(`💾 Documents saved successfully!`);
      Notify({
        type: ToastTypes.Success,
        content: "Documents locally saved successfully!",
      });
      return response;
    })
    .catch((error) => {
      console.error(`❌ Error while Add/Update Document:>>>`, error);
      Notify({
        type: ToastTypes.Error,
        content: "Error while Add/Update Documents!",
      });
      throw error;
    });
};

/**
 * Get One Docs from DB
 */
export const getDocFromDB = async (
  docId: string,
  database: TypeDatabase = PouchDBList.localDB
): Promise<Document> => {
  let document: any;
  await database
    .get(docId, {
      attachments: true,
      // binary: true
    })
    .then((response) => {
      document = response;
    })
    .catch((error) => {
      Notify({ type: ToastTypes.Error, content: error });
      throw error;
    });

  return document;
};

/**
 * Get All Docs from DB
 */
export const getAllDocsFromDB = async (
  options?: PouchDBAllDocsOptions,
  database: TypeDatabase = PouchDBList.localDB
): Promise<PouchDB.Core.AllDocsResponse<any>> => {
  return await database
    .allDocs({ ...options })
    .then((response) => response)
    .catch((error) => {
      Notify({ type: ToastTypes.Error, content: error });
      throw error;
    });
};

/**
 * Get Docs Filtered by Index
 */
export const getDocsByIndexFromDB = async (
  request: PouchDB.Find.FindRequest<any>,
  database: TypeDatabase = PouchDBList.localDB
): Promise<any[]> => {
  return await database
    .find(request)
    .then((response) => response.docs)
    .catch((error) => {
      console.error(`❌ Error Getting Document:>>>`, error);
      Notify({ type: ToastTypes.Error, content: error });
      throw error;
    });
};

/**
 * Get Doc's Attachment
 */
export const getAttachmentFromDB = async (
  docId: string,
  attachmentName: string,
  database: TypeDatabase = PouchDBList.localDB
): Promise<any> => {
  return await database
    .getAttachment(docId, attachmentName)
    .then((attachment) => attachment)
    .catch((error) => {
      // console.error(`❌ Error Getting Attachment:>>>`, error);
      // Notify({ type: ToastTypes.Error, content: error });
      // throw error;

      if (error.name) {
        return error;
      }
    });
};

/**
 * Create Indexes If Not Exist
 */
export const createDBIndexesIfNotExist = async (
  indexesToCreate: string[],
  database: TypeDatabase = PouchDBList.localDB
) => {
  let DBIndexes: string[] = [];
  await database.getIndexes().then(async (response) => {
    console.log("getIndexes():>>> response:>>>", response);
    if (response.indexes[1] && response.indexes[1].def.fields) {
      DBIndexes = response.indexes[1].def.fields.map((dbIndex, i) => {
        const curentKey = Object.keys(dbIndex)[0];
        const isEqual = curentKey === indexesToCreate[i];

        if (isEqual) return curentKey;
        else return "";
      });
    }
    if (DBIndexes.length !== indexesToCreate.length) {
      DBIndexes = indexesToCreate;
      await database
        .createIndex({ index: { fields: indexesToCreate } })
        .then(() => {
          console.log("Index Created Successfully!", DBIndexes);
        })
        .catch((error) => {
          console.error(`❌ Error Creating Indexes:>>>`, error);
          // Notify({ type: ToastTypes.Error, content: error });
          throw error;
        });
    }
  });

  return DBIndexes;
};

/**
 * Remove Doc from DB
 */
export const removeDocFromDB = async (
  doc: Document,
  database: TypeDatabase = PouchDBList.localDB
) => {
  const params: PouchDBDocParams = { _id: doc._id, _rev: doc._rev };
  return await database
    .remove(params)
    .then((response) => {
      console.log(`🚮 Document "${response.id}" removed successfully!`, doc);
      Notify({
        type: ToastTypes.Success,
        content: "Document removed successfully!",
      });
      return response;
    })
    .catch((error) => {
      console.error(`❌ Error Removing Document:>>>`, error);
      Notify({ type: ToastTypes.Error, content: error });
      throw error;
    });
};
