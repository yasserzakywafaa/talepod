import { ButtonHTMLAttributes, CSSProperties, FC, ReactNode } from "react";

import Icon from "./Icon";

type BtnVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "magic"
  | "glass"
  | "danger";
type BtnSize = "sm" | "md" | "lg";

export interface BtnProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  children?: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: string;
  full?: boolean;
  style?: CSSProperties;
}

const sizes: Record<BtnSize, CSSProperties> = {
  sm: { fontSize: 13, padding: "8px 14px", borderRadius: "var(--r-md)" },
  md: { fontSize: 15, padding: "12px 20px", borderRadius: "var(--r-md)" },
  lg: { fontSize: 16, padding: "16px 26px", borderRadius: "var(--r-md)" },
};

const variants: Record<BtnVariant, CSSProperties> = {
  primary: {
    background: "var(--honey-400)",
    color: "#fff",
    boxShadow: "var(--shadow-sm)",
  },
  secondary: {
    background: "var(--surface)",
    color: "var(--accent)",
    border: "1.5px solid var(--twilight-300)",
  },
  ghost: { background: "transparent", color: "var(--fg)" },
  magic: {
    background: "linear-gradient(135deg, var(--honey-400), var(--twilight-500))",
    color: "#fff",
    borderRadius: "var(--r-pill)",
    boxShadow: "var(--shadow-md)",
  },
  glass: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  danger: {
    background: "transparent",
    color: "var(--danger)",
    border: "1.5px solid var(--danger)",
  },
};

export const Btn: FC<BtnProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  full,
  style,
  ...rest
}) => (
  <button
    {...rest}
    style={{
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition:
        "transform var(--dur-2) var(--ease-soft), background var(--dur-2), box-shadow var(--dur-2)",
      width: full ? "100%" : "auto",
      whiteSpace: "nowrap",
      ...sizes[size],
      ...variants[variant],
      ...style,
    }}
  >
    {icon && <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
    {children}
  </button>
);

type IconBtnTone = "default" | "glass" | "primary" | "ghost";

export interface IconBtnProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  name: string;
  size?: number;
  tone?: IconBtnTone;
  style?: CSSProperties;
}

const iconBtnTones: Record<IconBtnTone, CSSProperties> = {
  default: {
    background: "var(--surface)",
    color: "var(--fg)",
    border: "1px solid var(--border)",
  },
  glass: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  primary: {
    background: "var(--honey-400)",
    color: "#fff",
    boxShadow: "var(--glow-honey)",
  },
  ghost: { background: "transparent", color: "var(--fg)" },
};

export const IconBtn: FC<IconBtnProps> = ({
  name,
  size = 44,
  tone = "default",
  style,
  ...rest
}) => (
  <button
    {...rest}
    aria-label={rest["aria-label"] ?? name}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      ...iconBtnTones[tone],
      ...style,
    }}
  >
    <Icon name={name} size={Math.round(size * 0.45)} />
  </button>
);
