import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { ProfileAvatar } from "src/components/shared/ProfileAvatar";
import { AdminStatusChip } from "src/features/dashboardShared/AdminStatusChip";
import {
  formatAdminDateTime,
  getUserRoleLabel,
  getUserRoleTone,
  getUserStatusTone,
} from "src/features/dashboardShared/userPresentation";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import type { User } from "src/shared/types/user";

type AdminUserInfoCardProps = {
  user: User;
};

/** The web's `UserInfoCard`, stacked for a phone instead of split in two. */
export const AdminUserInfoCard = ({ user }: AdminUserInfoCardProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const theme = useAppTheme();
  const { fontFamily } = theme.tokens;

  const fullName =
    `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim();
  const contact = getUserProfileContact(user).value;

  const rows: { label: string; value: string }[] = [
    { label: t("admin.user.userId"), value: user.userId ?? "—" },
    {
      label: t("admin.user.created"),
      value: formatAdminDateTime(user.createdAt, i18n.language),
    },
    {
      label: t("admin.user.lastLogin"),
      value: user.lastLogin
        ? formatAdminDateTime(user.lastLogin, i18n.language)
        : t("admin.user.notAvailable"),
    },
    {
      label: t("admin.user.subscription"),
      value: user.subscription?.type ?? t("admin.user.notAvailable"),
    },
  ];

  return (
    <BrandCard style={styles.card}>
      <View style={styles.identity}>
        <ProfileAvatar user={user} size={72} />
        <View style={styles.identityText}>
          <DisplayText size={20} numberOfLines={2}>
            {fullName || contact || t("stories.unknownAuthor")}
          </DisplayText>
          <View style={styles.chips}>
            <AdminStatusChip
              label={t(`admin.users.statusValues.${user.status}`)}
              tone={getUserStatusTone(user.status)}
            />
            <AdminStatusChip
              label={getUserRoleLabel(user.role, t)}
              tone={getUserRoleTone(user.role)}
            />
          </View>
          {contact ? (
            <Text
              numberOfLines={1}
              style={[
                styles.contact,
                {
                  color: theme.colors.onSurface,
                  fontFamily: fontFamily.medium,
                },
              ]}
            >
              {contact}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text
              style={[
                styles.rowLabel,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: fontFamily.regular,
                },
              ]}
            >
              {row.label}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.rowValue,
                {
                  color: theme.colors.onSurface,
                  fontFamily: fontFamily.medium,
                },
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, gap: 16 },
  identity: { flexDirection: "row", alignItems: "center", gap: 14 },
  identityText: { flex: 1, gap: 6 },
  chips: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  contact: { fontSize: 13, includeFontPadding: false },
  rows: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowLabel: { fontSize: 13, includeFontPadding: false },
  rowValue: { fontSize: 13, flexShrink: 1, textAlign: "right", includeFontPadding: false },
});
