import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { PillButton } from "src/components/brand/PillButton";
import { SectionLabel } from "src/components/brand/SectionLabel";
import type { Avatar } from "src/shared/types/avatar";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

type AvatarPickerProps = {
  value: string | null;
  avatars: Avatar[];
  isLoading: boolean;
  onSelect: (avatar: Avatar | null) => void;
  /** Logged out: avatars are user-scoped, so invite sign-in instead of a gap. */
  enabled: boolean;
  onRequestLogin: () => void;
  onManage?: () => void;
  /** Avatars could not be fetched — offer a retry instead of an empty rail. */
  loadError?: RequestErrorKind | null;
  onRetry?: () => void;
};

/**
 * Inline avatar picker — the native read of web `AvatarPicker`: a rail of
 * portrait tiles with a honey ring on the active one, a dashed "None" tile,
 * and a dashed login card when signed out.
 */
export const AvatarPicker = ({
  value,
  avatars,
  isLoading,
  onSelect,
  enabled,
  onRequestLogin,
  onManage,
  loadError = null,
  onRetry,
}: AvatarPickerProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { radius, brand, shadow, fontFamily } = theme.tokens;

  const header = (
    <View style={styles.header}>
      <SectionLabel>{t("avatars.picker.title")}</SectionLabel>
      {enabled && onManage ? (
        <PillButton variant="text" compact onPress={onManage}>
          {t("avatars.picker.manage")}
        </PillButton>
      ) : null}
    </View>
  );

  if (!enabled) {
    return (
      <View style={styles.block}>
        {header}
        <View
          style={[
            styles.dashed,
            {
              borderRadius: radius.md,
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.prompt,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("avatars.picker.loginPrompt")}
          </Text>
          <PillButton compact icon="login" onPress={onRequestLogin}>
            {t("avatars.picker.login")}
          </PillButton>
        </View>
      </View>
    );
  }

  /**
   * The picker is one optional field on a form that still works without it,
   * so a failed fetch stays contained here rather than replacing the screen.
   */
  if (loadError && avatars.length === 0 && !isLoading) {
    return (
      <View style={styles.block}>
        {header}
        <View
          style={[
            styles.dashed,
            {
              borderRadius: radius.md,
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.prompt,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t(
              loadError === "offline"
                ? "avatars.picker.offline"
                : "avatars.picker.failed",
            )}
          </Text>
          {onRetry ? (
            <PillButton
              compact
              variant="outlined"
              icon="refresh"
              onPress={onRetry}
            >
              {t("serviceError.retry", { ns: "common" })}
            </PillButton>
          ) : null}
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.block}>
        {header}
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (avatars.length === 0) {
    return (
      <View style={styles.block}>
        {header}
        <View
          style={[
            styles.dashed,
            {
              borderRadius: radius.md,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.prompt,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("avatars.picker.empty")}
          </Text>
        </View>
      </View>
    );
  }

  const tileStyle = (selected: boolean) => [
    styles.tile,
    selected ? shadow.sm : shadow.xs,
    {
      borderRadius: radius.md,
      backgroundColor: theme.colors.surface,
      borderColor: selected ? brand.honey[400] : theme.colors.outlineVariant,
    },
  ];

  return (
    <View style={styles.block}>
      {header}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        <Pressable
          onPress={() => onSelect(null)}
          accessibilityRole="button"
          accessibilityLabel={t("avatars.picker.noneAria")}
          accessibilityState={{ selected: !value }}
          style={tileStyle(!value)}
        >
          <View
            style={[
              styles.noneCircle,
              { borderColor: theme.colors.outlineVariant },
            ]}
          >
            <MaterialCommunityIcons
              name="plus"
              size={22}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.medium,
              },
            ]}
          >
            {t("avatars.picker.none")}
          </Text>
        </Pressable>

        {avatars.map((avatar) => {
          const selected = value === avatar._id;
          return (
            <Pressable
              key={avatar._id}
              onPress={() => onSelect(avatar)}
              accessibilityRole="button"
              accessibilityLabel={t("avatars.picker.useAria", {
                name: avatar.name,
              })}
              accessibilityState={{ selected }}
              style={tileStyle(selected)}
            >
              {avatar.portraitUrl ? (
                <Image
                  source={{ uri: avatar.portraitUrl }}
                  style={styles.portrait}
                />
              ) : (
                <View
                  style={[
                    styles.noneCircle,
                    { borderColor: theme.colors.outlineVariant },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={22}
                    color={theme.colors.onSurfaceVariant}
                  />
                </View>
              )}
              <Text
                numberOfLines={1}
                style={[
                  styles.name,
                  {
                    color: selected
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant,
                    fontFamily: fontFamily.medium,
                  },
                ]}
              >
                {avatar.name}
              </Text>
              {selected ? (
                <View
                  style={[styles.check, { backgroundColor: brand.honey[400] }]}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={12}
                    color="#FFFFFF"
                  />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  block: { gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dashed: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  prompt: { fontSize: 13, lineHeight: 19, includeFontPadding: false },
  rail: { gap: 8, paddingVertical: 4, paddingRight: 4 },
  tile: {
    width: 84,
    padding: 8,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
  },
  noneCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  portrait: { width: 56, height: 56, borderRadius: 28 },
  name: { fontSize: 11, includeFontPadding: false },
  check: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
