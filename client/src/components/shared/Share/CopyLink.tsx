import { Link } from "@mui/icons-material";
import {
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { trackEvent } from "src/shared/utils/ga4";

export interface CopyLinkProps {
  url: string;
}

export const CopyLink = (props: CopyLinkProps) => {
  const { url } = props;
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const handleCopyUrlToClipboard = () => {
    trackEvent("share", { platform: "copy_link" });

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

  const handleCloseSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setIsUrlCopied(false);
  };

  return (
    <>
      <Tooltip title="Copy link">
        <IconButton onClick={handleCopyUrlToClipboard} color="primary">
          <Link />
        </IconButton>
      </Tooltip>

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
    </>
  );
};
