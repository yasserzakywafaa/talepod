import {
  Box,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { Facebook, Link, Telegram, WhatsApp } from "@mui/icons-material";

import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

interface ShareStory {
  url: string;
  story: Story;
}

const ShareStory = (props: ShareStory) => {
  const { url } = props;
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  console.log(isUrlCopied);

  const handleCopyUrlToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => setIsUrlCopied(true));
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Position textarea off-screen
    textArea.style.display = "none";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      //   setSnackbarMessage('Link copied to clipboard!');
      setIsUrlCopied(true);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      setIsUrlCopied(true);
    } finally {
      document.body.removeChild(textArea);
    }
  };

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

  const handleCloseSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setIsUrlCopied(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      mt={4}
      gap={2}
    >
      <Tooltip title="Copy link">
        <IconButton onClick={handleCopyUrlToClipboard} color="primary">
          <Link />
        </IconButton>
      </Tooltip>

      {/* <IconButton color="primary" onClick={handleNativeShareStory}>
        <Share />
      </IconButton> */}

      <Tooltip title="Share on WhatsApp">
        <IconButton
          component="a"
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <WhatsApp />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share on Facebook">
        <IconButton
          component="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <Facebook />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share on Telegram">
        <IconButton
          component="a"
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <Telegram />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Share on X">
        <IconButton
          component="a"
          href={`https://twitter.com/share?url=${encodeURIComponent(
            url
          )}&text=Check%20out%20this%20story!`}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <X />
        </IconButton>
      </Tooltip> */}

      {/* <Tooltip title="Share on LinkedIn">
        <IconButton
          component="a"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          <LinkedIn />
        </IconButton>
      </Tooltip> */}

      <Snackbar
        open={isUrlCopied}
        autoHideDuration={3000}
        sx={{ bottom: "48px", left: "24px" }}
        onClose={handleCloseSnackBar}
      >
        <Card
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.secondary.main,
          }}
        >
          <CardContent sx={{ p: "0.75rem !important" }}>
            Link copied to clipboard
          </CardContent>
        </Card>
      </Snackbar>
    </Box>
  );
};

export default ShareStory;
