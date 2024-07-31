import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useEffect } from "react";

const InstallWebAppOnMacOs: React.FC = () => {
  useEffect(() => {}, []);

  return (
    <>
      <Typography variant="body1" textAlign="center">
        Install this app on your Mac and enjoy the mobile application
        functionality.
      </Typography>

      <br />

      <Typography variant="body1" textAlign="center">
        From
        <b> Safari </b> browser, <br />
        simply tap the <IosShareOutlined color="primary" /> icon and then
        <Typography variant="body1" color="primary">
          "Add to Dock"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnMacOs;
