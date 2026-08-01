import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { ProfileAvatar } from "src/components/shared/ProfileAvatar";
import {
  AdminRowActionsMenu,
  type AdminRowAction,
} from "src/features/dashboardShared/AdminRowActionsMenu";
import { AdminStatusChip } from "src/features/dashboardShared/AdminStatusChip";
import {
  formatAdminDate,
  getUserRoleLabel,
  getUserRoleTone,
  getUserStatusTone,
  getUserShortId,
  isUserBlocked,
} from "src/features/dashboardShared/userPresentation";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import type { User } from "src/shared/types/user";

type AdminUserCardProps = {
  user: User;
  onPress: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
};

/**
 * One row of the web's users data grid, folded into a card.
 *
 * A seven-column grid cannot survive a phone, so the columns become a stack:
 * identity on top, the two chips beside it, and the numbers the grid showed
 * (stories, join date) as a footer line.
 */
export const AdminUserCard = ({
  user,
  onPress,
  onBlock,
  onUnblock,
  onDelete,
}: AdminUserCardProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const theme = useAppTheme();
  const { fontFamily } = theme.tokens;

  const fullName =
    `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim();
  const contact = getUserProfileContact(user).value;
  const blocked = isUserBlocked(user.status);

  const actions: AdminRowAction[] = [
    {
      key: "view",
      label: t("stories.viewEdit"),
      icon: "pencil-outline",
      onPress,
    },
    blocked
      ? {
          key: "unblock",
          label: t("admin.users.unblock"),
          icon: "account-check-outline",
          onPress: onUnblock,
        }
      : {
          key: "block",
          label: t("admin.users.block"),
          icon: "block-helper",
          onPress: onBlock,
        },
    {
      key: "delete",
      label: tCommon("delete"),
      icon: "delete-outline",
      destructive: true,
      onPress: onDelete,
    },
  ];

  return (
    <BrandCard onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <ProfileAvatar user={user} size={44} />

        <View style={styles.identity}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              { color: theme.colors.onSurface, fontFamily: fontFamily.semiBold },
            ]}
          >
            {fullName || contact || t("stories.unknownAuthor")}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.meta,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("stories.idLabel")} {getUserShortId(user)}
          </Text>
        </View>

        <AdminRowActionsMenu
          actions={actions}
          accessibilityLabel={t("admin.users.rowActions", {
            name: fullName || contact,
          })}
        />
      </View>

      {contact ? (
        <Text
          numberOfLines={1}
          style={[
            styles.contact,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {contact}
        </Text>
      ) : null}

      <View style={styles.chips}>
        <AdminStatusChip
          label={getUserRoleLabel(user.role, t)}
          tone={getUserRoleTone(user.role)}
        />
        <AdminStatusChip
          label={t(`admin.users.statusValues.${user.status}`)}
          tone={getUserStatusTone(user.status)}
        />
      </View>

      <View
        style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}
      >
        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="book-open-variant"
            size={15}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("admin.users.storiesCount", { count: user.storyCount ?? 0 })}
          </Text>
        </View>

        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={15}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {formatAdminDate(user.createdAt, i18n.language)}
          </Text>
        </View>
      </View>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%", padding: 14, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  identity: { flex: 1, gap: 2 },
  name: { fontSize: 15, includeFontPadding: false },
  meta: { fontSize: 12, includeFontPadding: false },
  contact: { fontSize: 13, includeFontPadding: false },
  chips: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerText: { fontSize: 12, includeFontPadding: false },
});
