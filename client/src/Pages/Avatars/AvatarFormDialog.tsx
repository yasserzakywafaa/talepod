import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { AvatarInput, EMPTY_AVATAR_INPUT } from "src/shared/types/avatar";
import { useEffect, useState } from "react";

import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";

export interface AvatarFormDialogProps {
  open: boolean;
  title: string;
  initialValue?: AvatarInput;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (input: AvatarInput) => void;
}

const GENDER_OPTIONS = ["Boy", "Girl", "Male", "Female", "Other"];

const AvatarFormDialog = ({
  open,
  title,
  initialValue,
  isSaving,
  onClose,
  onSubmit,
}: AvatarFormDialogProps) => {
  const [form, setForm] = useState<AvatarInput>(
    initialValue ?? EMPTY_AVATAR_INPUT,
  );

  // Reset the form whenever the dialog (re)opens for a new target.
  useEffect(() => {
    if (open) setForm(initialValue ?? EMPTY_AVATAR_INPUT);
  }, [open, initialValue]);

  const setField =
    (field: keyof AvatarInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "age" ? (value === "" ? undefined : Number(value)) : value,
      }));
    };

  const nameInvalid = hasCensoredWords(form.name);
  const canSave = Boolean(form.name.trim()) && !nameInvalid && !isSaving;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "var(--font-display)" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            required
            label="Name"
            value={form.name}
            error={nameInvalid}
            helperText={nameInvalid ? "Not Appropriate 🙈" : " "}
            onChange={setField("name")}
          />
          <TextField
            label="Relationship"
            placeholder="son, daughter, wife…"
            value={form.relationship ?? ""}
            onChange={setField("relationship")}
          />
          <TextField
            type="number"
            label="Age"
            value={form.age ?? ""}
            onChange={setField("age")}
            slotProps={{ htmlInput: { min: 0, max: 120 } }}
          />
          <TextField
            select
            label="Gender"
            value={form.gender ?? ""}
            onChange={setField("gender")}
          >
            <MenuItem value="">
              <em>Unspecified</em>
            </MenuItem>
            {GENDER_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Skin tone"
            placeholder="fair, olive, brown…"
            value={form.skinTone ?? ""}
            onChange={setField("skinTone")}
          />
          <TextField
            label="Eye color"
            placeholder="brown, blue…"
            value={form.eyeColor ?? ""}
            onChange={setField("eyeColor")}
          />
          <TextField
            label="Hair color"
            placeholder="black, blonde…"
            value={form.hairColor ?? ""}
            onChange={setField("hairColor")}
          />
          <TextField
            label="Hair style"
            placeholder="curly, short, ponytail…"
            value={form.hairStyle ?? ""}
            onChange={setField("hairStyle")}
          />
          <TextField
            label="Outfit"
            placeholder="red dress, blue pyjamas…"
            value={form.outfit ?? ""}
            onChange={setField("outfit")}
          />
          <TextField
            label="Distinguishing feature"
            placeholder="freckles, glasses…"
            value={form.distinguishingFeature ?? ""}
            onChange={setField("distinguishingFeature")}
          />
          <TextField
            label="Notes"
            multiline
            minRows={2}
            sx={{ gridColumn: { sm: "1 / -1" } }}
            placeholder="Anything else that helps the illustration look right"
            value={form.notes ?? ""}
            onChange={setField("notes")}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSave}>
          {isSaving ? "Saving…" : "Save avatar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarFormDialog;
