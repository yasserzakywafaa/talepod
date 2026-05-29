import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import { usePricingModalContext } from "./store/Provider";

export const PricingModal = () => {
  const {
    store: { state, handleTogglePricingModal },
  } = usePricingModalContext();

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
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
        scroll="paper"
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
