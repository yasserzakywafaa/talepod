import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type Props = DrawerScreenProps<
  DashboardDrawerParamList,
  typeof mobileRoutes.dashboard.users
>;

export const DashboardUsersScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation("dashboard");
  const typography = useScreenTypography();

  return (
    <Page
      header={
        <DashboardAppBar navigation={navigation} routeName={route.name} />
      }
    >
      <PageBody>
        <Text variant="bodyMedium" style={typography.body}>
          {t("users.subtitle")}
        </Text>
      </PageBody>
    </Page>
  );
};
