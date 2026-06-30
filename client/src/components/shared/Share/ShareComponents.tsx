import { IconButton, Tooltip } from "@mui/material";
import {
  Facebook,
  Instagram,
  Telegram,
  WhatsApp,
  X,
} from "@mui/icons-material";
import { trackGtmEvent } from "src/shared/utils/gtm";

interface ShareButtonProps {
  url: string;
}

const trackShareClick = (platform: string) => {
  trackGtmEvent("share", { platform });
};

export const WhatsAppShareButton = (props: ShareButtonProps) => {
  const { url } = props;

  return (
    <Tooltip title="Share on WhatsApp">
      <IconButton
        component="a"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        onClick={() => trackShareClick("whatsapp")}
      >
        <WhatsApp />
      </IconButton>
    </Tooltip>
  );
};

export const FacebookShareButton = (props: ShareButtonProps) => {
  const { url } = props;

  return (
    <Tooltip title="Share on Facebook">
      <IconButton
        component="a"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        onClick={() => trackShareClick("facebook")}
      >
        <Facebook />
      </IconButton>
    </Tooltip>
  );
};

export const InstagramShareButton = (props: ShareButtonProps) => {
  const { url } = props;

  return (
    <Tooltip title="Share on Instagram">
      <IconButton
        component="a"
        href={`https://www.instagram.com/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        onClick={() => trackShareClick("instagram")}
      >
        <Instagram />
      </IconButton>
    </Tooltip>
  );
};

export const TwitterShareButton = (props: ShareButtonProps) => {
  const { url } = props;

  return (
    <Tooltip title="Share on X">
      <IconButton
        component="a"
        href={`https://x.com/share?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        onClick={() => trackShareClick("twitter")}
      >
        <X />
      </IconButton>
    </Tooltip>
  );
};

export const TelegramShareButton = (props: ShareButtonProps) => {
  const { url } = props;

  return (
    <Tooltip title="Share on Telegram">
      <IconButton
        component="a"
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        onClick={() => trackShareClick("telegram")}
      >
        <Telegram />
      </IconButton>
    </Tooltip>
  );
};
