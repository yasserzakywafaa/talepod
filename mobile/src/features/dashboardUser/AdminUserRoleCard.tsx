import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { SelectField } from "src/components/brand/SelectField";
import { getUserRoleLabel } from "src/features/dashboardShared/userPresentation";
import { UserRole, type User } from "src/shared/types/user";

type AdminUserRoleCardProps = {
  user: User;
  isUpdating: boolean;
  onChange: (role: UserRole) => void;
};

/**
 * The web's `RoleSelector`, which is an MUI `<Select>`. Mobile has no native
 * select, so this is `SelectField` — a Paper `Menu` behind an outlined field —
 * the same component every other picker in the app already uses.
 */
export const AdminUserRoleCard = ({
  user,
  isUpdating,
  onChange,
}: AdminUserRoleCardProps) => {
  const { t } = useTranslation("dashboard");
  const theme = useAppTheme();

  const options = Object.values(UserRole).map((role) => ({
    value: role,
    label: getUserRoleLabel(role, t),
  }));

  return (
    <BrandCard style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="shield-account-outline"
          size={20}
          color={theme.colors.primary}
        />
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
              fontFamily: theme.tokens.fontFamily.semiBold,
            },
          ]}
        >
          {t("admin.user.userRole")}
        </Text>
      </View>

      <SelectField
        label={t("admin.user.role")}
        value={user.role}
        options={options}
        surfaceColor={theme.colors.surface}
        onChange={(role) => {
          if (role !== user.role && !isUpdating) {
            onChange(role);
          }
        }}
      />

      <Text
        style={[
          styles.help,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.tokens.fontFamily.regular,
          },
        ]}
      >
        {t("admin.user.roleHelp")}
      </Text>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, gap: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 15, includeFontPadding: false },
  help: { fontSize: 12, lineHeight: 18, includeFontPadding: false },
});
