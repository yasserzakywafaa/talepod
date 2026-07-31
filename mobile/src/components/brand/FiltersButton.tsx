import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";

type FiltersButtonProps = {
  onPress: () => void;
  /** Shown as a honey count bubble when any filter is set. */
  activeCount?: number;
};

/** Trailing "Filters" affordance above the story lists, as on the web. */
export const FiltersButton = ({
  onPress,
  activeCount = 0,
}: FiltersButtonProps) => {
  const { t } = useTranslation("library");
  const theme = useAppTheme();
  const { fontFamily, radius, brand } = theme.tokens;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("page.filters")}
      hitSlop={8}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text
        style={[
          styles.label,
          { color: theme.colors.primary, fontFamily: fontFamily.semiBold },
        ]}
      >
        {t("page.filters")}
      </Text>

      {activeCount > 0 ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: brand.honey[400], borderRadius: radius.pill },
          ]}
        >
          <Text style={[styles.badgeLabel, { fontFamily: fontFamily.bold }]}>
            {activeCount}
          </Text>
        </View>
      ) : null}

      <MaterialCommunityIcons
        name="filter-variant"
        size={20}
        color={theme.colors.primary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 6,
    paddingVertical: 6,
  },
  label: { fontSize: 15, includeFontPadding: false },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    includeFontPadding: false,
  },
});
