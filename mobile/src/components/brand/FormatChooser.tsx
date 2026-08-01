import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { Gradient } from "src/components/shared/Gradient";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import type { StoryFormat } from "src/features/storyCreator/store/state";

const characterBunny = require("../../../assets/images/characters/sleeping_bunny_with_a_moon.webp");
const characterKitten = require("../../../assets/images/characters/dreamy_kitten.webp");
const characterOwl = require("../../../assets/images/characters/wise_owl.webp");
const characterLion = require("../../../assets/images/characters/lion_cub.webp");

const PREVIEW_HEIGHT = 110;

type FormatItem = {
  id: StoryFormat;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  badgeKey: string;
  titleKey: string;
  subKey: string;
};

const ITEMS: FormatItem[] = [
  {
    id: "comic",
    icon: "view-carousel-outline",
    badgeKey: "form.format.comic.badge",
    titleKey: "form.format.comic.title",
    subKey: "form.format.comic.sub",
  },
  {
    id: "long",
    icon: "book-open-outline",
    badgeKey: "form.format.long.badge",
    titleKey: "form.format.long.title",
    subKey: "form.format.long.sub",
  },
];

type FormatChooserProps = {
  value: StoryFormat;
  onChange: (value: StoryFormat) => void;
};

/**
 * Story-format picker — the native read of web `FormatChooser`: an illustrated
 * preview strip above a badge, serif title, one-line summary and a radio dot.
 */
export const FormatChooser = ({ value, onChange }: FormatChooserProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { radius, brand, semantic, fontFamily } = theme.tokens;

  return (
    <View style={styles.stack}>
      {ITEMS.map((item) => {
        const selected = value === item.id;

        return (
          <BrandCard
            key={item.id}
            selected={selected}
            onPress={() => onChange(item.id)}
            style={styles.card}
          >
            <FormatPreview kind={item.id} pagesLabel={t("form.format.comic.previewPages")} />

            <View style={styles.row}>
              <View
                style={[
                  styles.iconTile,
                  {
                    backgroundColor: selected
                      ? brand.honey[400]
                      : semantic.surface2,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={selected ? "#FFFFFF" : theme.colors.onSurface}
                />
              </View>

              <View style={styles.copy}>
                <BrandBadge
                  label={t(item.badgeKey)}
                  tone={selected ? "primary" : "secondary"}
                />
                <DisplayText size={18} style={styles.title}>
                  {t(item.titleKey)}
                </DisplayText>
                <Text
                  style={[
                    styles.sub,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: fontFamily.regular,
                    },
                  ]}
                >
                  {t(item.subKey)}
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  {
                    borderRadius: radius.pill,
                    backgroundColor: selected
                      ? brand.honey[400]
                      : "transparent",
                    borderWidth: selected ? 0 : 1.5,
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                {selected ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={14}
                    color="#FFFFFF"
                  />
                ) : null}
              </View>
            </View>
          </BrandCard>
        );
      })}
    </View>
  );
};

type FormatPreviewProps = {
  kind: StoryFormat;
  pagesLabel: string;
};

/** Illustrated placeholder strip — same artwork and ramps the web preview uses. */
const FormatPreview = ({ kind, pagesLabel }: FormatPreviewProps) => {
  const theme = useAppTheme();
  const { radius, fontFamily } = theme.tokens;

  if (kind === "comic") {
    return (
      <Gradient
        colors={["#22224F", "#433578"] as const}
        style={[styles.preview, { borderRadius: radius.md }]}
      >
        <View style={styles.panels}>
          {[characterBunny, characterKitten, characterOwl].map((art, index) => (
            <Gradient
              key={index}
              colors={["#FFE6A8", "#C9B6E8"] as const}
              style={styles.panel}
            >
              <Image source={art} style={styles.panelArt} resizeMode="contain" />
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
      style={[styles.preview, styles.previewRow, { borderRadius: radius.md }]}
    >
      <Gradient colors={["#FFE6A8", "#C9B6E8"] as const} style={styles.spine}>
        <Image source={characterLion} style={styles.spineArt} resizeMode="contain" />
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
                  index === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.32)",
              },
            ]}
          />
        ))}
      </View>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  stack: { gap: 12 },
  card: { padding: 14, gap: 10 },
  preview: {
    height: PREVIEW_HEIGHT,
    padding: 6,
    overflow: "hidden",
  },
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
    height: PREVIEW_HEIGHT - 16,
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
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  title: { marginTop: 2 },
  sub: { fontSize: 11, lineHeight: 16, includeFontPadding: false },
  radio: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
