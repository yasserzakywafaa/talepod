import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const BackButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} className="back-button">
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
