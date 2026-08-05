import { useCallback } from "react";
import { Share } from "react-native";
import { useTranslation } from "react-i18next";

import { FloatingActionButton } from "src/components/brand/FloatingActionButton";
import { buildStoryShareUrl } from "src/shared/utils/buildStoryShareUrl";
import { logger } from "src/shared/logger";

type ShareStoryButtonProps = {
  slug: string;
  title: string;
  bottom: number;
};

/**
 * The web builds its own menu of per-network share buttons because a browser
 * has no system one. A phone does: `Share.share` opens the OS sheet, which
 * already lists WhatsApp, Messages, Mail, Copy and everything else installed,
 * ranked by who the user actually shares with. Re-creating a fixed six-network
 * menu on top of that would offer strictly less.
 */
export const ShareStoryButton = ({
  slug,
  title,
  bottom,
}: ShareStoryButtonProps) => {
  const { t } = useTranslation("story");

  const onShare = useCallback(() => {
    const url = buildStoryShareUrl(slug);
    // iOS reads `url` and ignores a URL inside `message`; Android has no `url`
    // field at all, so the link has to be in the message there.
    void Share.share(
      { title, message: `${title}\n${url}`, url },
      { dialogTitle: title },
    ).catch((error) => logger.error("Failed to share story", error));
  }, [slug, title]);

  return (
    <FloatingActionButton
      icon="share-variant"
      onPress={onShare}
      accessibilityLabel={t("reader.share.aria")}
      bottom={bottom}
    />
  );
};
