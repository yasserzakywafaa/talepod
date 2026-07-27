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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("story");
  const [form, setForm] = useState<AvatarInput>(
    initialValue ?? EMPTY_AVATAR_INPUT,
  );

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
            label={t("avatars.form.name")}
            value={form.name}
            error={nameInvalid}
            helperText={nameInvalid ? t("avatars.form.notAppropriate") : " "}
            onChange={setField("name")}
          />
          <TextField
            label={t("avatars.form.relationship")}
            placeholder={t("avatars.form.relationshipPlaceholder")}
            value={form.relationship ?? ""}
            onChange={setField("relationship")}
          />
          <TextField
            type="number"
            label={t("avatars.form.age")}
            value={form.age ?? ""}
            onChange={setField("age")}
            slotProps={{ htmlInput: { min: 0, max: 120 } }}
          />
          <TextField
            select
            label={t("avatars.form.gender")}
            value={form.gender ?? ""}
            onChange={setField("gender")}
          >
            <MenuItem value="">
              <em>{t("avatars.form.genderUnspecified")}</em>
            </MenuItem>
            {GENDER_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t("avatars.form.skinTone")}
            placeholder={t("avatars.form.skinTonePlaceholder")}
            value={form.skinTone ?? ""}
            onChange={setField("skinTone")}
          />
          <TextField
            label={t("avatars.form.eyeColor")}
            placeholder={t("avatars.form.eyeColorPlaceholder")}
            value={form.eyeColor ?? ""}
            onChange={setField("eyeColor")}
          />
          <TextField
            label={t("avatars.form.hairColor")}
            placeholder={t("avatars.form.hairColorPlaceholder")}
            value={form.hairColor ?? ""}
            onChange={setField("hairColor")}
          />
          <TextField
            label={t("avatars.form.hairStyle")}
            placeholder={t("avatars.form.hairStylePlaceholder")}
            value={form.hairStyle ?? ""}
            onChange={setField("hairStyle")}
          />
          <TextField
            label={t("avatars.form.outfit")}
            placeholder={t("avatars.form.outfitPlaceholder")}
            value={form.outfit ?? ""}
            onChange={setField("outfit")}
          />
          <TextField
            label={t("avatars.form.feature")}
            placeholder={t("avatars.form.featurePlaceholder")}
            value={form.distinguishingFeature ?? ""}
            onChange={setField("distinguishingFeature")}
          />
          <TextField
            label={t("avatars.form.notes")}
            multiline
            minRows={2}
            sx={{ gridColumn: { sm: "1 / -1" } }}
            placeholder={t("avatars.form.notesPlaceholder")}
            value={form.notes ?? ""}
            onChange={setField("notes")}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="secondary" onClick={onClose} disabled={isSaving}>
          {t("avatars.form.cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSave}>
          {isSaving ? t("avatars.form.saving") : t("avatars.form.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarFormDialog;
