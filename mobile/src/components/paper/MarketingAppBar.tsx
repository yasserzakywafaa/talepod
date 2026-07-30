import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import {
  navigateToCreateStory,
  openRootSheet,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { AppButton } from "./AppButton";

type MarketingAppBarProps = {
  navigation: DrawerNavigationProp<MainDrawerParamList>;
  showCreateOnHome?: boolean;
};

export const MarketingAppBar = ({
  navigation,
  showCreateOnHome: _showCreateOnHome,
}: MarketingAppBarProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const handleCreate = () => {
    if (auth.isAuthenticated) {
      navigateToCreateStory();
      return;
    }
    openRootSheet(mobileRoutes.public.login);
  };

  return (
    <Appbar.Header
        statusBarHeight={0}
        style={[styles.header, { backgroundColor: theme.colors.background }]}
        mode="center-aligned"
      >
        <View style={styles.left}>
          <AppButton
            mode="contained"
            onPress={handleCreate}
            buttonColor={theme.colors.primary}
          >
            {t("nav.createProject")}
          </AppButton>
        </View>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.openDrawer()}
          color={theme.colors.primary}
        />
      </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
  },
  left: {
    flex: 1,
    paddingLeft: 8,
    justifyContent: "center",
  },
});
