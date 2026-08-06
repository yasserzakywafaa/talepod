import { useTranslation } from "react-i18next";

import { FloatingActionButton } from "src/components/brand/FloatingActionButton";

type BackToTopButtonProps = {
  visible: boolean;
  onPress: () => void;
  /** Raised where another floating control sits below it. */
  bottom?: number;
};

/** Pairs with `useBackToTop`, which owns the scroll wiring. */
export const BackToTopButton = ({
  visible,
  onPress,
  bottom = 28,
}: BackToTopButtonProps) => {
  const { t } = useTranslation("common");

  return (
    <FloatingActionButton
      icon="chevron-up"
      onPress={onPress}
      visible={visible}
      accessibilityLabel={t("backToTop")}
      bottom={bottom}
    />
  );
};
