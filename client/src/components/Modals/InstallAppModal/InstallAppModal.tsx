import { Box, Dialog, DialogContent } from "@mui/material";
import InstallWebAppOnAndroid from "./features/InstallWebAppOnAndroid";
import InstallWebAppOnIos from "./features/InstallWebAppOnIos";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";

import "./InstallAppModal.scss";
import { useState } from "react";

export const InstallAppModal = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  const { isIos } = useDetectBrowserType();

  const handleOnDialogClose = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Box className="install-app-popup">
      <Dialog open={isDialogOpen} onClose={handleOnDialogClose}>
        {/* <DialogTitle>Install App</DialogTitle> */}

        <DialogContent sx={{ backgroundColor: "transparent" }}>
          {isIos ? <InstallWebAppOnIos /> : <InstallWebAppOnAndroid />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
