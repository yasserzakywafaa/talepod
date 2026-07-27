import { Box } from "@mui/material";

import { Story } from "src/components/StoryCreator/store/state";
import {
  FacebookShareButton,
  InstagramShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsAppShareButton,
} from "./ShareComponents";
import { CopyLink } from "./CopyLink";

interface ShareStory {
  url?: string;
  story?: Story;
}

const Share = (props: ShareStory) => {
  const url = props.url || window.location.href;

  //   const handleNativeShareStory = async (): Promise<void> => {
  //     if (navigator.share) {
  //       try {
  //         await navigator.share({
  //           url,
  //           text: story.title,
  //           title: story.title,
  //         });
  //       } catch (error) {
  //         console.error("❌ Error sharing the story!", error);
  //         throw new Error(`❌ Error sharing the story! ${error}`);
  //       }
  //     }
  //   };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        my: 2,
        gap: 1
      }}>
      <CopyLink url={url} />
      <WhatsAppShareButton url={url} />
      <FacebookShareButton url={url} />
      <InstagramShareButton url={url} />
      <TwitterShareButton url={url} />
      <TelegramShareButton url={url} />
    </Box>
  );
};

export default Share;
