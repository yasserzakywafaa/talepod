import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MarketingDrawerParamList } from "src/application/navigation/MarketingDrawerNavigator";
import { MarketingScreenBody } from "src/components/layout/PageScaffold";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type Props = DrawerScreenProps<
  MarketingDrawerParamList,
  typeof mobileRoutes.public.contact
>;

export const ContactScreen = (_props: Props) => {
  const { t } = useTranslation("page");
  const typography = useScreenTypography();

  return (
    <MarketingScreenBody>
      <Text variant="headlineSmall" style={typography.title}>
        {t("contact.title")}
      </Text>
      <Text variant="bodyMedium" style={typography.body}>
        {t("contact.mobileBody")}
      </Text>
    </MarketingScreenBody>
  );
};
