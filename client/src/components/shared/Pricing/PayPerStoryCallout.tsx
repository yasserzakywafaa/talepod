import { Badge, Btn, Icon } from "src/components/shared/v2";
import { Box, Typography } from "@mui/material";

import { usePricing } from "./usePricing";

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
        sx={{
          background: "var(--surface)",
          borderRadius: "var(--r-xl, 20px)",
          border: "1.5px dashed var(--border-strong, var(--border))",
          p: { xs: 2.5, sm: "26px 32px" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background:
              "linear-gradient(160deg, var(--honey-300, #F2C45C), var(--twilight-500, #6F57BD))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="local_activity" size={32} color="#fff" />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
            <Badge tone="twilight">No subscription</Badge>
            <Typography variant="caption" color="text.secondary">
              For occasional bedtimes
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              lineHeight: 1.15,
              color: "var(--fg)",
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
                color: "var(--fg)",
              }}
            >
              {priceLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / story
            </Typography>
          </Box>
          <Btn
            variant="primary"
            size="md"
            icon="auto_fix_high"
            onClick={handleBuyStory}
          >
            Buy one story
          </Btn>
        </Box>
      </Box>
    </Box>
  );
};

export default PayPerStoryCallout;
