import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";

import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
import { MarketingAppBar } from "src/components/paper/MarketingAppBar";

/** Header for library/contact/pricing shown in the main drawer or authenticated shell. */
export const useDrawerPageHeader = (titleKey: string) => {
  const { t } = useTranslation("common");
  const shellDrawer = useMainShellDrawer();
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  if (shellDrawer) {
    return <MainShellAppBar title={t(titleKey)} />;
  }

  return <MarketingAppBar navigation={navigation} />;
};
