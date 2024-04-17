// const store = configureStore({
//   reducer: {
//     settingsReducer: SettingsReducer,
//   },
//   devTools: process.env.NODE_ENV === "development",
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types
//         ignoredActions: [
//           // "SETTINGS/fetch_data_from_db/fulfilled",
//           // "SETTINGS/insert_uploaded_file_into_db/fulfilled",
//         ],
//         // Ignore these paths in the state
//         ignoredPaths: [], //  ["settingsReducer"]
//       },
//     });
//   },
// });

const store = {};

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;

export default store;
