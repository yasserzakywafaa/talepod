import { CSSProperties, FC, ReactNode } from "react";

import Icon from "./Icon";

type ChipTone = "honey" | "twilight" | "mint" | "blush" | "outline";

export interface ChipProps {
  children?: ReactNode;
  tone?: ChipTone;
  selected?: boolean;
  onClick?: () => void;
  icon?: string;
}

const chipTones: Record<ChipTone, { bg: string; fg: string; border?: string }> = {
  honey: { bg: "oklch(0.95 0.05 85)", fg: "var(--honey-700)" },
  twilight: { bg: "oklch(0.93 0.04 290)", fg: "var(--twilight-700)" },
  mint: { bg: "var(--mint)", fg: "oklch(0.3 0.06 195)" },
  blush: { bg: "var(--blush)", fg: "oklch(0.3 0.08 25)" },
  outline: {
    bg: "transparent",
    fg: "var(--fg)",
    border: "1px solid var(--border-strong)",
  },
};

export const Chip: FC<ChipProps> = ({
  children,
  tone = "honey",
  selected,
  onClick,
  icon,
}) => {
  const t = chipTones[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        background: t.bg,
        color: t.fg,
        border: t.border || "none",
        cursor: onClick ? "pointer" : "default",
        outline: selected ? "2px solid var(--honey-400)" : "none",
        outlineOffset: 1,
      }}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
};

type BadgeTone = "honey" | "twilight" | "free" | "new" | "beta";

export interface BadgeProps {
  children?: ReactNode;
  tone?: BadgeTone;
}

const badgeTones: Record<BadgeTone, { bg: string; fg: string; border?: string }> = {
  honey: { bg: "var(--honey-400)", fg: "#fff" },
  twilight: { bg: "var(--twilight-500)", fg: "#fff" },
  free: { bg: "oklch(0.93 0.04 290)", fg: "var(--twilight-700)" },
  new: { bg: "var(--honey-400)", fg: "#fff" },
  beta: { bg: "transparent", fg: "var(--rose)", border: "1.5px solid var(--rose)" },
};

export const Badge: FC<BadgeProps> = ({ children, tone = "honey" }) => {
  const t = badgeTones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontFamily: "var(--font-body)",
        background: t.bg,
        color: t.fg,
        border: t.border || "none",
      }}
    >
      {children}
    </span>
  );
};

export interface CardProps {
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  style,
  onClick,
  padded = true,
  elevated = false,
}) => (
  <div
    onClick={onClick}
    style={{
      background: "var(--surface)",
      borderRadius: "var(--r-lg)",
      boxShadow: elevated ? "var(--shadow-md)" : "var(--shadow-xs)",
      border: elevated ? "none" : "1px solid var(--border)",
      padding: padded ? 18 : 0,
      cursor: onClick ? "pointer" : "default",
      transition:
        "transform var(--dur-2) var(--ease-soft), box-shadow var(--dur-2)",
      ...style,
    }}
  >
    {children}
  </div>
);
