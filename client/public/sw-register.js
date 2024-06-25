// main thread
if ("serviceWorker" in window.navigator) {
  // console.log("ServiceWorker:>>>");
  navigator.serviceWorker
    .register("/serviceworker.js")
    .then((res) => {
      // console.log("ServiceWorker:>>> Registered!", res)
    })
    .catch((error) =>
      console.error("❌ Failed to register Service Worker!", { error })
    );
}
