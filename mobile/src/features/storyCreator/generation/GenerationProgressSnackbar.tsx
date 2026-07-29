import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
        <Text style={{ color: theme.colors.inverseOnSurface }}>{message}</Text>
      </Snackbar>
    </Portal>
  );
};
