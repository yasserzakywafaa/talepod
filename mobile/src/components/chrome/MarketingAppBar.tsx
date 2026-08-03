import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { AppBarLoginButton } from "src/components/chrome/AppBarLoginButton";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";

type MarketingAppBarProps = {
  navigation: DrawerNavigationProp<MainDrawerParamList>;
  showCreateOnHome?: boolean;
  title?: string;
};

/** Public-shell header — same V2 chrome as `MainShellAppBar`. */
export const MarketingAppBar = ({
  navigation,
  showCreateOnHome: _showCreateOnHome,
  title,
}: MarketingAppBarProps) => {
  const { t } = useTranslation("common");
  const theme = useAppTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.bar}>
        {/* Creating is public, as on the web: guests can fill the whole form
            and are only asked to sign in when they hit Generate. */}
        <PillButton compact onPress={() => navigateToCreateStory()}>
          {t("nav.createProject")}
        </PillButton>

        <View style={styles.spacer} />

        <AppBarLoginButton />

        <Pressable
          onPress={() => navigation.openDrawer()}
          accessibilityRole="button"
          accessibilityLabel={t("settings.menu")}
          hitSlop={8}
          style={({ pressed }) => [
            styles.menu,
            { borderColor: theme.colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <MaterialCommunityIcons
            name="menu"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>

      {title ? (
        <DisplayText
          size={26}
          color={theme.colors.primary}
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </DisplayText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  spacer: { flex: 1 },
  menu: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { paddingHorizontal: 16, paddingBottom: 8 },
});
