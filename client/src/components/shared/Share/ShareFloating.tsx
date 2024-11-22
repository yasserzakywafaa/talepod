import { SpeedDial, SpeedDialAction } from "@mui/material";
import {
  FacebookShareButton,
  InstagramShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsAppShareButton,
} from "./ShareComponents";
import { CopyLink } from "./CopyLink";

import { Share as ShareIcon } from "@mui/icons-material";

interface ShareFloatingStory {
  url?: string;
}

export const ShareFloating = (props: ShareFloatingStory) => {
  const url = props.url || window.location.href;

  return (
    <SpeedDial
      ariaLabel="Share"
      sx={{
        bottom: "6rem",
        right: "1.5rem",
        position: "fixed",
      }}
      icon={<ShareIcon />}
      FabProps={{
        size: "small",
      }}
    >
      <SpeedDialAction icon={CopyLink({ url })} />

      <SpeedDialAction icon={WhatsAppShareButton({ url })} />

      <SpeedDialAction icon={FacebookShareButton({ url })} />

      <SpeedDialAction icon={InstagramShareButton({ url })} />

      <SpeedDialAction icon={TwitterShareButton({ url })} />

      <SpeedDialAction icon={TelegramShareButton({ url })} />
    </SpeedDial>
  );
};
