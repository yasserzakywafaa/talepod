import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { useScreenTypography } from "src/components/layout/useScreenTypography";
import { ContactForm } from "src/screens/marketing/features/ContactForm";

type Props = DrawerScreenProps<
  MainDrawerParamList,
  typeof mobileRoutes.public.contact
>;

export const ContactScreen = (_props: Props) => {
  const { t } = useTranslation("page");
  const typography = useScreenTypography();
  const header = useDrawerPageHeader("nav.contact");

  return (
    <Page header={header}>
      <PageBody>
        <Text variant="bodyMedium" style={typography.body}>
          {t("contact.subtitle")}
        </Text>
        <ContactForm />
      </PageBody>
    </Page>
  );
};
