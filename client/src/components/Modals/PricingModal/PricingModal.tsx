import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { usePricingModalContext } from "./store/Provider";
import Pricing from "src/components/shared/Pricing";

interface PricingModalProps {
  isPricingDialogOpen: boolean;
  setIsPricingDialogOpen: (isDialogOpen: boolean) => void;
}

export const PricingModal = (props: PricingModalProps) => {
  const {
    store: { state, handleTogglePricingModal },
  } = usePricingModalContext();

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && reason === "backdropClick") return;

    handleCloseModal();
  };

  const handleCloseModal = () => {
    handleTogglePricingModal();
  };

  return (
    <>
      <Dialog
        maxWidth="lg"
        scroll="body"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent>
          <Pricing />
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="close"
            variant="contained"
            startIcon={<Close />}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
