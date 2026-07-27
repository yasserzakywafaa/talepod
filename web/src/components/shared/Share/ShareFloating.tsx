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
      <SpeedDialAction
        icon={CopyLink({ url })}
        slotProps={{ fab: { component: "span" } }}
      />

      <SpeedDialAction
        icon={WhatsAppShareButton({ url })}
        slotProps={{ fab: { component: "span" } }}
      />

      <SpeedDialAction
        icon={FacebookShareButton({ url })}
        slotProps={{ fab: { component: "span" } }}
      />

      <SpeedDialAction
        icon={InstagramShareButton({ url })}
        slotProps={{ fab: { component: "span" } }}
      />

      <SpeedDialAction
        icon={TwitterShareButton({ url })}
        slotProps={{ fab: { component: "span" } }}
      />

      <SpeedDialAction
        icon={TelegramShareButton({ url })}
        slotProps={{ fab: { component: "span" } }}
      />
    </SpeedDial>
  );
};
