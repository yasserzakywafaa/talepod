import { CSSProperties, FC, ReactNode } from "react";

export interface InputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  helper?: string;
  suffix?: ReactNode;
}

export const Input: FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  helper,
  suffix,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label
        style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-2)" }}
      >
        {label}
      </label>
    )}
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "var(--surface)",
        borderRadius: "var(--r-md)",
        border: `1.5px solid ${error ? "var(--danger)" : "var(--border)"}`,
      }}
    >
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "12px 14px",
          fontFamily: "inherit",
          fontSize: 15,
          color: "var(--fg)",
          background: "transparent",
          border: "none",
          outline: "none",
          borderRadius: "var(--r-md)",
        }}
      />
      {suffix && (
        <div style={{ padding: "0 12px", color: "var(--fg-3)", fontSize: 13 }}>
          {suffix}
        </div>
      )}
    </div>
    {helper && (
      <div
        style={{ fontSize: 12, color: error ? "var(--danger)" : "var(--fg-3)" }}
      >
        {helper}
      </div>
    )}
  </div>
);

export type SegmentedOption = string | { value: string; label: ReactNode };

export interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}

export const Segmented: FC<SegmentedProps> = ({
  options,
  value,
  onChange,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      background: "var(--surface-2)",
      padding: 4,
      borderRadius: "var(--r-md)",
      gap: 2,
      ...style,
    }}
  >
    {options.map((o) => {
      const v = typeof o === "string" ? o : o.value;
      const l = typeof o === "string" ? o : o.label;
      const sel = value === v;
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          style={{
            border: "none",
            background: sel ? "var(--surface)" : "transparent",
            color: sel ? "var(--fg)" : "var(--fg-2)",
            padding: "8px 16px",
            borderRadius: 10,
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: sel ? "var(--shadow-xs)" : "none",
          }}
        >
          {l}
        </button>
      );
    })}
  </div>
);

export interface ToggleSwitchProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    aria-pressed={on}
    style={{
      width: 46,
      height: 28,
      borderRadius: 14,
      background: on ? "var(--honey-400)" : "var(--border-strong)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "background var(--dur-2)",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 3,
        left: on ? 21 : 3,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "var(--shadow-xs)",
        transition: "left var(--dur-2) var(--ease-soft)",
      }}
    />
  </button>
);
