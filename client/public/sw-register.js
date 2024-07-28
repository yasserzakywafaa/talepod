// main thread
if ("serviceWorker" in window.navigator) {
  navigator.serviceWorker
    .register("/serviceworker.js")
    .then((registration) => {
      console.log(
        "ℹ️ Service Worker registered with scope: ",
        registration.scope
      );
    })
    .catch((error) =>
      console.error("❌ Failed to register Service Worker!", { error })
    );
}
