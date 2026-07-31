import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { Gradient } from "src/components/shared/Gradient";
import { DisplayText } from "src/components/brand/DisplayText";
import { ArtStyles } from "src/shared/artStyles";

/**
 * The samples are 4:3 (640×480). A near-square tile with `cover` cropped a
 * fifth off each side and pushed the child and fox out of frame, leaving just
 * canopy — so the tile carries the artwork's own ratio and nothing is lost.
 */
const TILE_WIDTH = 200;
const TILE_HEIGHT = 150;

type ArtStyleChooserProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Visual art-style picker — the native read of web `ArtStyleChooser`: a
 * horizontal rail of sample renders with a dark scrim, serif label and a honey
 * check on the active tile.
 */
export const ArtStyleChooser = ({ value, onChange }: ArtStyleChooserProps) => {
  const theme = useAppTheme();
  const { radius, shadow, glowHoney, brand } = theme.tokens;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
    >
      {ArtStyles.map((style) => {
        const selected = value === style.id;

        return (
          <Pressable
            key={style.id}
            onPress={() => onChange(style.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${style.label} — ${style.description}`}
            style={({ pressed }) => [
              styles.tile,
              selected ? glowHoney : shadow.xs,
              {
                borderRadius: radius.lg,
                borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
                borderColor: selected
                  ? brand.honey[400]
                  : theme.colors.outlineVariant,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View style={[styles.clip, { borderRadius: radius.lg - 1 }]}>
              {/* Swatch shows through until the sample render decodes. */}
              <Gradient
                colors={style.swatch}
                style={StyleSheet.absoluteFillObject}
              />
              <Image
                source={style.thumbnail}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />

              {/* Bottom scrim so the label stays legible on any artwork —
                  same three stops the web uses, kept short enough to sit
                  behind the caption rather than over the illustration. */}
              <Gradient
                colors={
                  [
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.55)",
                    "rgba(0,0,0,0.85)",
                  ] as const
                }
                style={styles.scrim}
              />

              <View style={styles.caption}>
                <DisplayText size={15} color="#FFFFFF" numberOfLines={1}>
                  {style.label}
                </DisplayText>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.description,
                    { fontFamily: theme.tokens.fontFamily.regular },
                  ]}
                >
                  {style.description}
                </Text>
              </View>

              {selected ? (
                <View
                  style={[
                    styles.check,
                    { backgroundColor: brand.honey[400] },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={14}
                    color="#FFFFFF"
                  />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rail: { gap: 12, paddingVertical: 4, paddingRight: 4 },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    overflow: "hidden",
  },
  clip: { flex: 1, overflow: "hidden" },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "48%",
  },
  caption: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 2,
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(255,255,255,0.82)",
    includeFontPadding: false,
  },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
