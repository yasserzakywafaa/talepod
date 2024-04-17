import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

export type TypeDatabase = PouchDB.Database<{}>;

export interface IPouchDBList {
  localDB: TypeDatabase | undefined;
  remoteDB: TypeDatabase | undefined;
}

export const DATABASE_NAME = "react_pwa_ai_file_uploader_db";

export type IPouchDBAllDocsOptions =
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

export const PouchDBList: IPouchDBList = {
  localDB: new PouchDB(PouchDBOptions.name, PouchDBOptions),
  remoteDB: new PouchDB(
    `http://admin:root@localhost:5984/${DATABASE_NAME}`,
    PouchDBOptions
  ),
};
