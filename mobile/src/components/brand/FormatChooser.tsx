import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { FormatPreview } from "src/components/brand/FormatPreview";
import type { StoryFormat } from "src/features/storyCreator/store/state";

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
            <FormatPreview
              kind={item.id}
              pagesLabel={t("form.format.comic.previewPages")}
            />

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

const styles = StyleSheet.create({
  stack: { gap: 12 },
  card: { padding: 14, gap: 10 },
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
