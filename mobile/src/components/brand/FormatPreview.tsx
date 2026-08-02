import { Image, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { Gradient } from "src/components/shared/Gradient";
import type { StoryFormat } from "src/features/storyCreator/store/state";

const characterBunny = require("../../../assets/images/characters/sleeping_bunny_with_a_moon.webp");
const characterKitten = require("../../../assets/images/characters/dreamy_kitten.webp");
const characterOwl = require("../../../assets/images/characters/wise_owl.webp");
const characterLion = require("../../../assets/images/characters/lion_cub.webp");

export const FORMAT_PREVIEW_HEIGHT = 110;

type FormatPreviewProps = {
  kind: StoryFormat;
  pagesLabel: string;
  /** Taller strip for the marketing panels, which have the room for it. */
  height?: number;
};

/**
 * Illustrated placeholder strip — same artwork and ramps the web preview uses.
 * Shared by the create-story `FormatChooser` and the marketing story-formats
 * section so both show the same thing.
 */
export const FormatPreview = ({
  kind,
  pagesLabel,
  height = FORMAT_PREVIEW_HEIGHT,
}: FormatPreviewProps) => {
  const theme = useAppTheme();
  const { radius, fontFamily } = theme.tokens;

  if (kind === "comic") {
    return (
      <Gradient
        colors={["#22224F", "#433578"] as const}
        style={[styles.preview, { height, borderRadius: radius.md }]}
      >
        <View style={styles.panels}>
          {[characterBunny, characterKitten, characterOwl].map((art, index) => (
            <Gradient
              key={index}
              colors={["#FFE6A8", "#C9B6E8"] as const}
              style={styles.panel}
            >
              <Image
                source={art}
                style={styles.panelArt}
                resizeMode="contain"
              />
            </Gradient>
          ))}
        </View>
        <View style={styles.pagesPill}>
          <Text
            style={[styles.pagesLabel, { fontFamily: fontFamily.semiBold }]}
          >
            {pagesLabel}
          </Text>
        </View>
      </Gradient>
    );
  }

  return (
    <Gradient
      colors={["#22224F", "#742F25"] as const}
      style={[
        styles.preview,
        styles.previewRow,
        { height, borderRadius: radius.md },
      ]}
    >
      <Gradient
        colors={["#FFE6A8", "#C9B6E8"] as const}
        style={[styles.spine, { height: height - 16 }]}
      >
        <Image
          source={characterLion}
          style={styles.spineArt}
          resizeMode="contain"
        />
      </Gradient>
      <View style={styles.lines}>
        {[80, 100, 100, 70, 100, 60].map((width, index) => (
          <View
            key={index}
            style={[
              styles.line,
              {
                width: `${width}%`,
                height: index === 0 ? 7 : 5,
                backgroundColor:
                  index === 0
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.32)",
              },
            ]}
          />
        ))}
      </View>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  preview: { padding: 6, overflow: "hidden" },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
  },
  panels: { flex: 1, flexDirection: "row", gap: 4 },
  panel: {
    flex: 1,
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  panelArt: { width: "85%", height: "88%" },
  pagesPill: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pagesLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  spine: {
    width: 60,
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  spineArt: { width: "90%", height: "80%" },
  lines: { flex: 1, gap: 4 },
  line: { borderRadius: 3 },
});
