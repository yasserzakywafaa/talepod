import { BillingInterval } from "./usePricing";
import { Segmented } from "src/components/shared/v2";

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
  <Segmented
    value={value}
    onChange={(v) => onChange(v as BillingInterval)}
    options={[
      { value: "month", label: "Monthly" },
      {
        value: "year",
        label: savingsPercent ? `Yearly · save ${savingsPercent}%` : "Yearly",
      },
    ]}
  />
);

export default BillingToggle;
