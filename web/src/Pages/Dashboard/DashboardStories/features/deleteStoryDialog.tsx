import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { DeleteOutlined } from "@mui/icons-material";
import { Trans, useTranslation } from "react-i18next";

const DeleteStoryDialog = ({
  isOpen,
  onClose,
  onConfirm,
  storyTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  storyTitle: string;
}) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
          <DeleteOutlined color="error" fontSize="large" />
          <Typography variant="h5">{t("stories.deleteStoryTitle")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          <Trans
            t={t}
            i18nKey="stories.deleteStoryConfirm"
            values={{ name: storyTitle }}
            components={{
              br: <br />,
              strong: <strong className="text-underline-secondary" />,
            }}
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onClose}>
          {tCommon("cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<DeleteOutlined />}
        >
          {tCommon("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStoryDialog;
