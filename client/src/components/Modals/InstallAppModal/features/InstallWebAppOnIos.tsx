import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useEffect } from "react";

const InstallWebAppOnIos: React.FC = () => {
  useEffect(() => {}, []);

  return (
    <>
      <Typography variant="body1" textAlign="center">
        Install this app on your iPhone and enjoy the mobile application
        functionality
      </Typography>

      <br />

      <Typography variant="body1" textAlign="center">
        Simply tap the <IosShareOutlined color="primary" /> icon and then
        <Typography variant="body1" color="primary">
          "Add to Home Screen"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnIos;
