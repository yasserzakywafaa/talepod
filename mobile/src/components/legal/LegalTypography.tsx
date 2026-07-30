import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { mobileRoutes, type PublicMarketingScreenRoute } from "src/application/routes";
import { navigateToPublicMarketingScreen } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

export const LegalSection = ({ children }: { children: ReactNode }) => (
  <View style={styles.section}>{children}</View>
);

export const LegalH5 = ({ children }: { children: string }) => {
  const theme = useTheme();
  return (
    <Text
      variant="titleMedium"
      style={[styles.heading, { color: theme.colors.primary }]}
    >
      {children}
    </Text>
  );
};

export const LegalH6 = ({ children }: { children: string }) => {
  const theme = useTheme();
  return (
    <Text
      variant="titleSmall"
      style={[styles.subheading, { color: theme.colors.secondary }]}
    >
      {children}
    </Text>
  );
};

export const LegalSubtitle = ({ children }: { children: string }) => {
  const theme = useTheme();
  return (
    <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
      {children}
    </Text>
  );
};

export const LegalP = ({ children }: { children: ReactNode }) => {
  const typography = useScreenTypography();
  return (
    <Text variant="bodyMedium" style={[typography.body, styles.paragraph]}>
      {children}
    </Text>
  );
};

type DefinitionItem = {
  term: string;
  description: ReactNode;
};

export const LegalDefinitionList = ({ items }: { items: DefinitionItem[] }) => {
  const typography = useScreenTypography();
  const theme = useTheme();

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.term} style={styles.listItem}>
          <Text
            variant="bodyMedium"
            style={[typography.title, styles.listTerm]}
          >
            {item.term}
          </Text>
          <Text
            variant="bodyMedium"
            style={[typography.body, { color: theme.colors.onSurfaceVariant }]}
          >
            {item.description}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const LegalBulletList = ({ items }: { items: string[] }) => {
  const typography = useScreenTypography();

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Text
          key={item}
          variant="bodyMedium"
          style={[typography.body, styles.bulletItem]}
        >
          {"\u2022 "}
          {item}
        </Text>
      ))}
    </View>
  );
};

export const LegalLink = ({
  children,
  screen,
}: {
  children: string;
  screen: PublicMarketingScreenRoute;
}) => {
  const theme = useTheme();
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  return (
    <Text
      style={{ color: theme.colors.primary, textDecorationLine: "underline" }}
      onPress={() => navigateToPublicMarketingScreen(screen, isAuthenticated)}
    >
      {children}
    </Text>
  );
};

export const legalWebsiteUrl = "https://www.talepod.com";

export const legalContactPath = `${legalWebsiteUrl}/contact`;

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    gap: 8,
  },
  heading: {
    marginBottom: 4,
  },
  subheading: {
    marginTop: 4,
  },
  paragraph: {
    marginBottom: 8,
  },
  list: {
    gap: 12,
    marginVertical: 8,
  },
  listItem: {
    gap: 4,
  },
  listTerm: {
    fontWeight: "600",
  },
  bulletItem: {
    paddingLeft: 4,
  },
});
