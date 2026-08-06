import { Image, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import type { User } from "src/shared/types/user";

/**
 * Who wrote the story. Reads `authorProfile` off the story the server already
 * populates, so this needs no request of its own.
 */
export const StoryAuthorInfo = ({ author }: { author?: User }) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();

  const given = author?.name?.givenName ?? "";
  const family = author?.name?.familyName ?? "";
  const fullName = `${given} ${family}`.trim();
  if (!fullName) return null;

  return (
    <View
      style={[
        styles.root,
        {
          borderColor: theme.colors.secondary,
          borderRadius: theme.tokens.radius.lg,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="information-outline"
        size={18}
        color={theme.colors.secondary}
      />
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, flexShrink: 1 }}
      >
        {t("reader.author.createdBy")}{" "}
        <Text style={{ fontFamily: theme.tokens.fontFamily.bold }}>
          {fullName}
        </Text>
      </Text>

      {author?.picture ? (
        <Image
          source={{ uri: author.picture }}
          style={styles.picture}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View
          style={[styles.picture, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Text style={[styles.initials, { color: theme.colors.onSurfaceVariant }]}>
            {`${given.charAt(0)}${family.charAt(0)}`.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  picture: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 10, fontWeight: "700" },
});
