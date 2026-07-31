import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { Gradient } from "src/components/shared/Gradient";
import { DisplayText } from "src/components/brand/DisplayText";
import { ArtStyles } from "src/shared/artStyles";

/** Matches web `ArtStyleChooser` tile size (160×150). */
const TILE_WIDTH = 160;
const TILE_HEIGHT = 150;

type ArtStyleChooserProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Visual art-style picker — mirrors web `ArtStyleChooser`: a horizontal rail of
 * sample renders with a bottom scrim, overlaid serif label and a honey check.
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
                borderWidth: selected ? 1.5 : 1,
                borderColor: selected
                  ? brand.honey[400]
                  : theme.colors.outlineVariant,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Gradient
              colors={style.swatch}
              style={StyleSheet.absoluteFillObject}
            />
            <Image
              source={style.thumbnail}
              style={styles.thumbnail}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />

            {selected ? (
              <View
                style={[styles.check, { backgroundColor: brand.honey[400] }]}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            ) : null}

            <View style={styles.captionOverlay}>
              <Gradient
                colors={
                  [
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.55)",
                    "rgba(0,0,0,0.85)",
                  ] as const
                }
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.caption}>
                <DisplayText size={14} color="#FFFFFF" numberOfLines={1}>
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
  thumbnail: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  captionOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  caption: {
    paddingTop: 28,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 2,
  },
  description: {
    fontSize: 11,
    lineHeight: 14,
    color: "rgba(255,255,255,0.8)",
    includeFontPadding: false,
  },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
