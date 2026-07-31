import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import {
  SelectField,
  type SelectOption,
} from "src/components/brand/SelectField";
import { getUserRoleLabel } from "src/features/dashboardShared/userPresentation";
import type { DashboardUsersFilters } from "src/features/dashboardUsers/store/state";
import { UserRole, UserStatus } from "src/shared/types/user";

type AdminUsersFiltersSheetProps = {
  visible: boolean;
  values: DashboardUsersFilters;
  onChange: <Key extends keyof DashboardUsersFilters>(
    key: Key,
    value: DashboardUsersFilters[Key],
  ) => void;
  onApply: () => void;
  onClear: () => void;
  onDismiss: () => void;
};

/**
 * Filters for the admin users list — the same bottom sheet as the story
 * filters, with the three things that actually narrow a user list: who they
 * are, what kind of account they hold, and whether it is in good standing.
 */
export const AdminUsersFiltersSheet = ({
  visible,
  values,
  onChange,
  onApply,
  onClear,
  onDismiss,
}: AdminUsersFiltersSheetProps) => {
  const { t } = useTranslation(["dashboard", "library"]);
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { radius, shadow } = theme.tokens;

  const anyLabel = t("dashboard:admin.users.filterAny");

  // Annotated so `""` widens to the union rather than pinning the field's
  // generic to the empty-string literal.
  const roleOptions: SelectOption<UserRole | "">[] = [
    { value: "", label: anyLabel },
    ...Object.values(UserRole).map((role) => ({
      value: role,
      label: getUserRoleLabel(role, t),
    })),
  ];

  const statusOptions: SelectOption<UserStatus | "">[] = [
    { value: "", label: anyLabel },
    ...Object.values(UserStatus).map((status) => ({
      value: status,
      label: t(`dashboard:admin.users.statusValues.${status}`),
    })),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View
        style={[styles.backdrop, { backgroundColor: theme.colors.backdrop }]}
      >
        <Pressable
          style={styles.dismissArea}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t("library:filters.cancel")}
        />

        <View
          style={[
            styles.sheet,
            shadow.lg,
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom,
              // The sheet spans the screen, so sideways it meets the notch.
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <View style={styles.grabberWrap}>
            <View
              style={[
                styles.grabber,
                { backgroundColor: theme.colors.outlineVariant },
              ]}
            />
          </View>

          <View style={styles.header}>
            <DisplayText size={22} color={theme.colors.primary}>
              {t("library:filters.title")}
            </DisplayText>
            <Pressable
              onPress={onDismiss}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("library:filters.cancel")}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              label={t("dashboard:admin.users.filterSearch")}
              placeholder={t("dashboard:admin.users.filterSearchHint")}
              value={values.search}
              onChangeText={(next) => onChange("search", next)}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="magnify" />}
              outlineStyle={{ borderRadius: radius.md }}
              style={{ backgroundColor: theme.colors.background }}
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
              onSubmitEditing={onApply}
              returnKeyType="search"
            />

            <SelectField
              label={t("dashboard:admin.users.filterRole")}
              value={values.role}
              options={roleOptions}
              onChange={(next) => onChange("role", next)}
            />

            <SelectField
              label={t("dashboard:admin.users.filterStatus")}
              value={values.status}
              options={statusOptions}
              onChange={(next) => onChange("status", next)}
            />
          </ScrollView>

          <View
            style={[
              styles.footer,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <PillButton
              variant="text"
              compact
              onPress={onDismiss}
              color={theme.colors.onSurfaceVariant}
            >
              {t("library:filters.cancel")}
            </PillButton>
            <View style={styles.footerActions}>
              <PillButton variant="outlined" compact onPress={onClear}>
                {t("library:filters.clear")}
              </PillButton>
              <PillButton compact onPress={onApply}>
                {t("library:filters.apply")}
              </PillButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  dismissArea: { flex: 1, minHeight: 64 },
  sheet: { maxHeight: "88%", overflow: "hidden" },
  grabberWrap: { alignItems: "center", paddingTop: 8 },
  grabber: { width: 40, height: 4, borderRadius: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 24 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
});
