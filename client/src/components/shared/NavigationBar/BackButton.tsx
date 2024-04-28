import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <IconButton onClick={onClick} className="back-button">
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
