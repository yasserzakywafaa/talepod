import {
  AutoFixHighOutlined,
  LocalActivityOutlined,
} from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";

import { usePricing } from "./usePricing";
import {
  borderStrongDark,
  borderStrongLight,
  honey300,
  twilight500,
} from "src/application/shared/themes";

/* Pay-per-story callout (per the design's "Pay as you go" section). Self-gating:
   renders only when a one-time Stripe price exists, so it stays inert until a
   pay-per-story price is configured in Stripe. */
const PayPerStoryCallout: React.FC = () => {
  const { isPayPerStoryAvailable, getOneTimePrice, handleBuyStory } =
    usePricing();

  if (!isPayPerStoryAvailable) return null;

  const price = getOneTimePrice();
  const priceLabel = price ? `${price.currency}${price.amount}` : "";

  return (
    <Box sx={{ width: "100%", maxWidth: 1180, mx: "auto" }}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: "var(--r-xl, 20px)",
          border: `1.5px dashed ${
            theme.palette.mode === "light" ? borderStrongLight : borderStrongDark
          }`,
          p: { xs: 2.5, sm: "26px 32px" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
        })}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `linear-gradient(160deg, ${honey300}, ${twilight500})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LocalActivityOutlined sx={{ fontSize: 32, color: "#fff" }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
            <Chip variant="badge" color="secondary" label="No subscription" />
            <Typography variant="caption" color="text.secondary">
              For occasional bedtimes
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              lineHeight: 1.15,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Just want one story? Pay as you go.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 560 }}
          >
            Buy a single bedtime story for <b>{priceLabel}</b> — includes audio,
            illustrations, and a keep-forever spot in your library. No recurring
            charge, no commitment.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", sm: "flex-end" },
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                lineHeight: 1,
                color: "text.primary",
              }}
            >
              {priceLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / story
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AutoFixHighOutlined />}
            onClick={handleBuyStory}
          >
            Buy one story
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PayPerStoryCallout;
