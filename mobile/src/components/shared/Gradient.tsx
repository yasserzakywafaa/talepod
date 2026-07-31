import { useMemo, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type GradientProps = {
  /** Two or more hex stops, in order. Mirrors the web `linear-gradient` list. */
  colors: readonly string[];
  /** Gradient axis. Web V2 uses vertical for scenes, diagonal for CTAs. */
  direction?: "vertical" | "horizontal";
  /** Band count — higher is smoother; 48 is imperceptible at phone DPI. */
  bands?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

type Rgba = { r: number; g: number; b: number; a: number };

const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

/** Accepts `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb(…)` and `rgba(…)`. */
const parseColor = (color: string): Rgba => {
  const value = color.trim();

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const full =
      hex.length === 3 || hex.length === 4
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: full.length >= 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    };
  }

  const parts = value
    .replace(/^rgba?\(/, "")
    .replace(/\)$/, "")
    .split(",")
    .map((part) => Number(part.trim()));

  return {
    r: parts[0] ?? 0,
    g: parts[1] ?? 0,
    b: parts[2] ?? 0,
    a: parts[3] ?? 1,
  };
};

const mix = (from: string, to: string, ratio: number) => {
  const a = parseColor(from);
  const b = parseColor(to);
  const r = clamp(a.r + (b.r - a.r) * ratio);
  const g = clamp(a.g + (b.g - a.g) * ratio);
  const bl = clamp(a.b + (b.b - a.b) * ratio);
  const alpha = Math.round((a.a + (b.a - a.a) * ratio) * 1000) / 1000;
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
};

/** Resolves the gradient into `bands` flat colors across all stops. */
const buildBands = (colors: readonly string[], bands: number) => {
  if (colors.length === 0) return [];
  if (colors.length === 1) return [colors[0]];

  const segments = colors.length - 1;
  return Array.from({ length: bands }, (_, index) => {
    const position = (index / (bands - 1)) * segments;
    const segment = Math.min(Math.floor(position), segments - 1);
    return mix(colors[segment], colors[segment + 1], position - segment);
  });
};

/**
 * Linear gradient built from stacked flat bands.
 *
 * The web design system uses gradients for the hero, story-cover placeholders
 * and scene previews. Rather than pull in a native gradient module (and the
 * rebuild that comes with it), the ramp is rendered as evenly-weighted flex
 * bands — visually identical for the soft, low-contrast ramps V2 uses.
 */
export const Gradient = ({
  colors,
  direction = "vertical",
  bands = 48,
  style,
  children,
}: GradientProps) => {
  const key = colors.join("|");
  const resolved = useMemo(
    () => buildBands(key.split("|"), bands),
    [key, bands],
  );

  const horizontal = direction === "horizontal";

  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          horizontal ? styles.row : styles.column,
          // Base coat: if a band ever fails to cover a subpixel row, the
          // colour behind it is a gradient stop rather than the surface.
          { backgroundColor: resolved[0] },
        ]}
        pointerEvents="none"
      >
        {resolved.map((color, index) => (
          <View
            key={`${color}-${index}`}
            style={[
              styles.band,
              // Bands overlap by 1px. Laying them out edge-to-edge leaves
              // hairline seams wherever `flex: 1` rounds down against the
              // device pixel grid — the visible lines across the cards.
              horizontal ? styles.overlapRow : styles.overlapColumn,
              { backgroundColor: color },
            ]}
          />
        ))}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { overflow: "hidden" },
  column: { flexDirection: "column" },
  row: { flexDirection: "row" },
  band: { flex: 1 },
  overlapColumn: { marginBottom: -1 },
  overlapRow: { marginRight: -1 },
});
