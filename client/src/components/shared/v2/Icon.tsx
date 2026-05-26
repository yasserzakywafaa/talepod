import { CSSProperties, FC } from "react";

/**
 * Material Symbols Outlined icon — the same icon family MUI ships, loaded as a
 * variable font via <link> in index.html. Pass a symbol name like "auto_awesome".
 */
export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  weight?: number;
  fill?: 0 | 1;
  style?: CSSProperties;
}

const Icon: FC<IconProps> = ({
  name,
  size = 22,
  color = "currentColor",
  weight = 400,
  fill = 0,
  style,
}) => (
  <span
    className="material-symbols-outlined"
    aria-hidden
    style={{
      fontSize: size,
      lineHeight: 1,
      color,
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      userSelect: "none",
      ...style,
    }}
  >
    {name}
  </span>
);

export default Icon;
