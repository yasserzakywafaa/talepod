import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useState } from "react";

import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { useTranslation } from "react-i18next";

/** Shape shared by the curated dropdown option lists (Moral/Tone/Environment). */
export interface SelectableOption {
  name: string;
  value: string;
  description?: string;
}

/** Sentinel value stored for user-entered custom options. The human-readable
 *  text lives in `name`/`description`; the coded `value` stays constant so the
 *  existing `storyParams.*.value` DB indexes keep bucketing cleanly. */
export const CUSTOM_OPTION_VALUE = "CUSTOM";

export interface CustomizableSelectProps {
  /** Field name (e.g. "moral") — echoed back to `onChange`. */
  name: string;
  label: string;
  /** Currently selected option object (curated or custom). */
  value: SelectableOption;
  /** Curated options to list. */
  options: SelectableOption[];
  /** Called with the field name and the full chosen option object. */
  onChange: (name: string, option: SelectableOption) => void;
}

/**
 * An MUI Select that also lets the user enter their own value via a "+ Add
 * custom…" item. The free text is profanity-checked (reusing `hasCensoredWords`)
 * and flows into the story prompt through the option's `name`, exactly like a
 * curated choice. Used for Moral, Tone, and Environment in the create form.
 */
const CustomizableSelect = ({
  name,
  label,
  value,
  options,
  onChange,
}: CustomizableSelectProps) => {
  const { t } = useTranslation("story");
  const isCustom = value?.value === CUSTOM_OPTION_VALUE;
  const [showCustomInput, setShowCustomInput] = useState(isCustom);
  const [customText, setCustomText] = useState(isCustom ? value.name : "");

  const labelId = `${name}-select-label`;
  const invalid = hasCensoredWords(customText);
  const selectValue =
    showCustomInput || isCustom ? CUSTOM_OPTION_VALUE : value?.value ?? "";

  const handleSelect = (event: SelectChangeEvent) => {
    const selected = event.target.value;
    if (selected === CUSTOM_OPTION_VALUE) {
      setShowCustomInput(true);
      return;
    }
    setShowCustomInput(false);
    const option = options.find((o) => o.value === selected);
    if (option) onChange(name, option);
  };

  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
    const trimmed = text.trim();
    if (trimmed && !hasCensoredWords(trimmed)) {
      onChange(name, {
        name: trimmed,
        value: CUSTOM_OPTION_VALUE,
        description: trimmed,
      });
    }
  };

  return (
    <FormControl className="form-item">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        name={name}
        label={label}
        variant="outlined"
        id={`${name}-select`}
        labelId={labelId}
        value={selectValue}
        onChange={handleSelect}
        renderValue={(selected) =>
          selected === CUSTOM_OPTION_VALUE
            ? customText.trim() || t("form.customSelect.custom")
            : options.find((o) => o.value === selected)?.name ?? ""
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
        <MenuItem value={CUSTOM_OPTION_VALUE}>
          <AddRounded fontSize="small" sx={{ mr: 1 }} />
          {t("form.customSelect.addCustom")}
        </MenuItem>
      </Select>

      {showCustomInput && (
        <TextField
          autoFocus
          size="small"
          sx={{ mt: 1 }}
          value={customText}
          placeholder={t("form.customSelect.placeholder", { label: label.toLowerCase() })}
          error={invalid}
          helperText={invalid ? t("form.notAppropriate") : " "}
          onChange={(event) => handleCustomTextChange(event.target.value)}
        />
      )}
    </FormControl>
  );
};

export default CustomizableSelect;
