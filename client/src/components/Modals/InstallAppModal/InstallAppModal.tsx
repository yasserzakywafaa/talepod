import { Box, Dialog, DialogContent } from "@mui/material";
import InstallWebAppOnAndroid from "./features/InstallWebAppOnAndroid";
import InstallWebAppOnIos from "./features/InstallWebAppOnIos";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";

import "./InstallAppModal.scss";

interface InstallAppModalProps {
  isInstallAppDialogOpen: boolean;
  setIsInstallAppDialogOpen: (isDialogOpen: boolean) => void;
}

export const InstallAppModal = (props: InstallAppModalProps) => {
  const { isInstallAppDialogOpen, setIsInstallAppDialogOpen } = props;
  const { isIos } = useDetectBrowserType();

  const handleOnDialogClose = () => {
    setIsInstallAppDialogOpen(false);
  };

  return (
    <Box className="install-app-popup">
      <Dialog open={isInstallAppDialogOpen} onClose={handleOnDialogClose}>
        {/* <DialogTitle>Install App</DialogTitle> */}

        <DialogContent>
          {isIos ? <InstallWebAppOnIos /> : <InstallWebAppOnAndroid />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
