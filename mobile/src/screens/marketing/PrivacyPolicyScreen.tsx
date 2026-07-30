import type { DrawerScreenProps } from "@react-navigation/drawer";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import { PrivacyPolicyBody } from "src/components/legal/PrivacyPolicyBody";
import { Page, PageBody } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type Props = DrawerScreenProps<
  MainDrawerParamList,
  typeof mobileRoutes.public.privacyPolicy
>;

/** July 1, 2024 — same as web (`01/07/2024` US format). Use ISO for Hermes. */
const PRIVACY_LAST_UPDATED = "2024-07-01";

export const PrivacyPolicyScreen = (_props: Props) => {
  const { t, i18n } = useTranslation("page");
  const theme = useTheme();
  const typography = useScreenTypography();
  const locale = localeFromLanguage(i18n.language);
  const header = useDrawerPageHeader("footer.privacyPolicy");

  return (
    <Page header={header}>
      <PageBody>
        <Text variant="headlineSmall" style={typography.title}>
          {t("legal.privacyTitle")}
        </Text>
        <Text
          variant="bodyMedium"
          style={[typography.badge, { marginBottom: 8 }]}
        >
          {t("legal.lastUpdated")}{" "}
          <Text style={{ fontWeight: "700", color: theme.colors.primary }}>
            {formatLocalizedDate(PRIVACY_LAST_UPDATED, locale, {
              dateStyle: "short",
            })}
          </Text>
        </Text>
        <PrivacyPolicyBody />
      </PageBody>
    </Page>
  );
};
