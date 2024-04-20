import { Refresh } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton = ({ onClick }: RefreshButtonProps) => {
  return (
    <IconButton className="refresh-button" onClick={onClick}>
      <Refresh />
    </IconButton>
  );
};

export default RefreshButton;
