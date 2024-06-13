import { ArrowBackIosNew } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = (props: BackButtonProps) => {
  return (
    <IconButton onClick={props.onClick} className="back-button">
      <ArrowBackIosNew />
    </IconButton>
  );
};

export default BackButton;
