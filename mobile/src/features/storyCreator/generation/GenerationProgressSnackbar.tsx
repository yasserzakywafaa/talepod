import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Portal, Snackbar, Text, useTheme } from "react-native-paper";

import { navigateToViewStory } from "src/application/navigation/rootNavigation";
import { getFloatingTabBarTotalInset } from "src/components/navigation/floatingTabBarConstants";
import { useGenerationContext } from "src/features/storyCreator/generation/Provider";

export const GenerationProgressSnackbar = () => {
  const { t } = useTranslation("story");
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(true);
  const {
    store: { job },
    manager: { dismissGeneration },
  } = useGenerationContext();

  useEffect(() => {
    setVisible(true);
    if (job?.textStatus === "ready") {
      const timer = setTimeout(() => {
        setVisible(false);
        dismissGeneration();
      }, 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [job?.textStatus, job?.slug, dismissGeneration]);

  if (!job || !visible) {
    return null;
  }

  const formatLabel =
    job.format === "comic"
      ? t("generating.chip.formatComic")
      : t("generating.chip.formatStory");

  const openViewStory = () => {
    if (!job.slug) return;
    dismissGeneration();
    navigateToViewStory(job.slug);
  };

  const message =
    job.textStatus === "pending"
      ? job.childName
        ? t("generating.chip.creatingNamed", {
            name: job.childName,
            format: formatLabel,
          })
        : t("generating.chip.creatingGeneric", { format: formatLabel })
      : job.textStatus === "ready"
        ? job.childName
          ? t("generating.chip.readyNamed", {
              name: job.childName,
              format: formatLabel,
            })
          : t("generating.chip.readyGeneric")
        : t("generating.chip.failedTitle");

  return (
    <Portal>
      <Snackbar
        visible
        onDismiss={() => {
          if (job.textStatus !== "pending") {
            dismissGeneration();
          }
        }}
        duration={job.textStatus === "pending" ? Number.POSITIVE_INFINITY : 6000}
        wrapperStyle={{ bottom: getFloatingTabBarTotalInset(insets.bottom) }}
        style={{ backgroundColor: theme.colors.inverseSurface }}
        action={
          job.textStatus === "ready"
            ? {
                label: t("generating.chip.viewStory"),
                onPress: openViewStory,
              }
            : job.textStatus === "failed"
              ? {
                  label: t("common:close", { ns: "common" }),
                  onPress: dismissGeneration,
                }
              : undefined
        }
      >
        {/*
         * Every state used to render as identical text — a user watching this
         * for "is it still working?" had nothing to look at but the words. A
         * leading icon that actually changes (spinner → check → error) is
         * the same signal the web snackbar gives with its CircularProgress.
         */}
        <View style={styles.row}>
          {job.textStatus === "pending" ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.inverseOnSurface}
            />
          ) : job.textStatus === "ready" ? (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={theme.colors.inverseOnSurface}
            />
          ) : (
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={theme.colors.error}
            />
          )}
          <Text
            style={[styles.text, { color: theme.colors.inverseOnSurface }]}
            numberOfLines={2}
          >
            {message}
          </Text>
        </View>
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  text: { flex: 1 },
});
