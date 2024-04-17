import { Refresh } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const RefreshButton = ({ onClick }) => {
  return (
    <IconButton className="refresh-button" onClick={onClick}>
      <Refresh />
    </IconButton>
  );
};

export default RefreshButton;
