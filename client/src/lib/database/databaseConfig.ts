import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

export type TypeDatabase = PouchDB.Database<{}>;

export interface PouchDBList {
  localDB: TypeDatabase;
  remoteDB: TypeDatabase;
}
export interface PouchDBDocParams {
  _id: string;
  _rev: string;
}

export const DATABASE_NAME = "react_pwa_ai_file_uploader_db";

export type PouchDBAllDocsOptions =
  | PouchDB.Core.AllDocsOptions
  | PouchDB.Core.AllDocsWithKeyOptions
  | PouchDB.Core.AllDocsWithKeysOptions
  | PouchDB.Core.AllDocsWithinRangeOptions;

export const PouchDBOptions = {
  // : PouchDB.AdapterWebSql.Configuration
  size: 400,
  prefix: "",
  revs_limit: 400,
  name: DATABASE_NAME,
  // adapter: "websql",
  auto_compaction: true,
  deterministic_revs: true,
};

export const PouchDBList: PouchDBList = {
  localDB: new PouchDB(PouchDBOptions.name, PouchDBOptions),
  remoteDB: new PouchDB(
    `http://admin:root@localhost:5984/${DATABASE_NAME}`,
    PouchDBOptions
  ),
};
