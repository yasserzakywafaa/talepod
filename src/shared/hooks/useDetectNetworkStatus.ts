import { useState } from "react";

interface UserDetetNetwaorkStatusState {
  online: boolean;
  status: string;
}

const useDetectNetworkStatus = () => {
  const [currentNetworkStatus, setCurrentNeworkStatus] =
    useState<UserDetetNetwaorkStatusState>({
      online: navigator.onLine,
      status: navigator.onLine ? "🟢 ONLINE" : "🔴 OFFLINE",
    });

  /**
   * Listen for a change in network status
   */
  window.addEventListener("online", (e) => {
    console.log("🟢 You are ONLINE");
    setCurrentNeworkStatus({
      ...currentNetworkStatus,
      online: true,
      status: "🟢 ONLINE",
    });
  });

  window.addEventListener("offline", (e) => {
    console.log("🔴 You are OFFLINE");
    setCurrentNeworkStatus({
      ...currentNetworkStatus,
      online: false,
      status: "🔴 OFFLINE",
    });
  });

  return [currentNetworkStatus];
};

export default useDetectNetworkStatus;
