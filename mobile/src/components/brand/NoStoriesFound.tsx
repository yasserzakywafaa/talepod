import { Image, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";

const unicorn = require("../../../assets/images/characters/unicorn_with_a_magic_wand_and_a_book.webp");

type NoStoriesFoundProps = {
  onCreate: () => void;
  /** Omitted when nothing is filtered — there is nothing to clear. */
  onClearFilters?: () => void;
};

/**
 * Empty state for the story lists — the native read of the web
 * `NoStoriesFound`: the unicorn mascot over a reassuring line, then the same
 * two ways out (create a story, or drop the filters).
 */
export const NoStoriesFound = ({
  onCreate,
  onClearFilters,
}: NoStoriesFoundProps) => {
  const { t } = useTranslation("library");
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <Image
        source={unicorn}
        style={styles.art}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      <DisplayText size={22} style={styles.title}>
        {t("noStoriesFound", { ns: "common" })}
      </DisplayText>

      <View style={styles.actions}>
        <PillButton onPress={onCreate} trailingIcon="shimmer">
          {t("page.emptyCreate")}
        </PillButton>
        {onClearFilters ? (
          <PillButton
            variant="outlined"
            icon="filter-variant-remove"
            onPress={onClearFilters}
            color={theme.colors.secondary}
          >
            {t("page.emptyClearFilters")}
          </PillButton>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 40,
    gap: 4,
  },
  art: { width: 200, height: 200 },
  title: { textAlign: "center", marginTop: 4 },
  actions: { alignItems: "center", gap: 10, marginTop: 20 },
});
