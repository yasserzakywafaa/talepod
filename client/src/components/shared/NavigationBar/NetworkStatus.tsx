import { Wifi, WifiOff } from "@mui/icons-material";

import { IconButton } from "@mui/material";
import useDetectNetworkStatus from "../../../shared/hooks/useDetectNetworkStatus";

const NetworkStatus = () => {
  const [currentNetworkStatus] = useDetectNetworkStatus();
  const { online } = currentNetworkStatus;

  return (
    <IconButton disabled className="network-status">
      {online && <Wifi className="network-status-online" />}
      {!online && <WifiOff className="network-status-offline" />}
    </IconButton>
  );
};

export default NetworkStatus;
