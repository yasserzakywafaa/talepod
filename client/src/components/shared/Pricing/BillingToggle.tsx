import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { BillingInterval } from "./usePricing";

interface BillingToggleProps {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  savingsPercent?: number;
}

/* Monthly/Yearly switch for the pricing surfaces. Presentational only — the
   parent owns the `usePricing` interval state so the toggle stays in sync with
   the prices it renders. */
const BillingToggle: React.FC<BillingToggleProps> = ({
  value,
  onChange,
  savingsPercent,
}) => (
  <ToggleButtonGroup
    exclusive
    size="small"
    value={value}
    onChange={(_event, next) => next && onChange(next as BillingInterval)}
  >
    <ToggleButton value="month">Monthly</ToggleButton>
    <ToggleButton value="year">
      {savingsPercent ? `Yearly · save ${savingsPercent}%` : "Yearly"}
    </ToggleButton>
  </ToggleButtonGroup>
);

export default BillingToggle;
