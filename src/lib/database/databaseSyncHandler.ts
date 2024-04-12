import { Notify, ToastTypes } from "src/components/Notification/Notification";
import { DBConfig } from ".";

interface SyncHadlerEventProps {
  change: any;
  direction: string;
}

interface DatabaseSyncHadlerProps {
  handleUpdateLocalDB?: () => void;
  handleUpdateSyncState: (state: boolean) => void;
}

const databaseSyncHandler = (props: DatabaseSyncHadlerProps) => {
  // Sync between local and server databases
  const DBSyncOptions: PouchDB.Replication.SyncOptions = {
    live: true,
    retry: true,
    since: "now",
    // filter: 'app/by_section',
    // query_params: { "section": section }
    // view: '',
    // doc_ids: '',
    // timeout: '',
    // selector: '',
    // heartbeat: '',
    // batch_size: '',
    // checkpoint: '',
    // batches_limit: '',
    // back_off_function: '',
  };
  const syncHandler = DBConfig.PouchDBList.localDB.sync(
    DBConfig.PouchDBList.remoteDB,
    DBSyncOptions,
    (info) => {
      console.log("🔄 Sync Callback:>>>", info);
    }
  );

  // syncHandler.cancel();

  syncHandler
    .on("change", (info: SyncHadlerEventProps) => {
      // Something has changed!
      props.handleUpdateSyncState(true);

      if (info.direction === "pull") {
        Notify({ type: ToastTypes.Info, content: "Updating from Server..." });
        console.log("🔄 Sync:>>> Pulling from Server Database ⬇⬇", info);
        props.handleUpdateLocalDB();
      } else {
        Notify({ type: ToastTypes.Info, content: "Saving to Server..." });
        console.log("🔄 Sync:>>> Pushing to Server Database ⬆⬆", info);
      }
    })
    .on("complete", () => {
      console.log(`🔄 Sync:>>> Complete`);
      Notify({ type: ToastTypes.Success, content: "Syncing Complete!" });
      props.handleUpdateSyncState(false);
    })
    .on("paused" || "denied" || "error", (error) => {
      // Document failed to replicate (e.g. due to permissions)
      // Replication was paused, usually because of a lost connection
      // console.log(`❌ Sync:>>> Error`, error);
      Notify({ type: ToastTypes.Error, content: error });
      props.handleUpdateSyncState(false);
    });
};

export default databaseSyncHandler;
