import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { SubscriptionPlanEnum } from "src/shared/user";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";
import { usePricingModalContext } from "../Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

export enum PriceTiers {
  Free = "Free",
  Professional = "Professional",
  Advanced = "Advanced",
}

export interface Tier {
  title: PriceTiers;
  subheader?: string;
  price: string;
  description: string[];
  buttonText: string;
  buttonVariant: string;
  buttonDisabled?: boolean;
  buttonAction?: () => void;
}

const Pricing = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
      },
    },
  } = useApplicationContext();
  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const currentUserPackage = {
    isFree:
      user?.subscription.subscriptionPlanType === SubscriptionPlanEnum.free,
    isPro: user?.subscription.subscriptionPlanType === SubscriptionPlanEnum.pro,
  };

  const tiers: Tier[] = [
    {
      title: PriceTiers.Free,
      price: "0",
      description: [
        "Standard customer support",
        "Create up to 7 bedtime stories",
        "Basic text-to-speech conversion",
        "Access to a limited story library",
      ],
      buttonText: currentUserPackage.isFree ? "Current Package" : "",
      buttonVariant: "text",
      buttonDisabled: true,
      buttonAction: () => true,
    },
    {
      title: PriceTiers.Professional,
      // subheader: "Recommended",
      price: "5",
      description: [
        "Priority customer support",
        "Customizable story parameters",
        "High-quality text-to-speech conversion",
        "Create up to 50 bedtime stories per month",
        // "Offline access to stories",
        // "Access to an extensive story library",
      ],
      buttonText: "Upgrade",
      buttonVariant: "contained",
      buttonAction: () => {
        if (!isAuthenticated) {
          handleToggleRegisterModal();
          return;
        }

        if (isAuthenticated && !currentUserPackage.isPro) {
          handleTogglePricingModal();
          return navigate(routes.checkout);
        }
      },
    },
    // {
    //   title: PriceTiers.Advanced,
    //   subheader: "Coming Soon",
    //   price: "",
    //   description: [
    //     "Unlimited story generation",
    //     "Access to exclusive story content",
    //     "Offline access to stories",
    //     "Personalized story recommendations",
    //     "Premium text-to-speech voices",
    //     "Custom voice options for TTS",
    //   ],
    //   buttonText: "Upgrade",
    //   buttonVariant: "outlined",
    // },
  ];

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 2, sm: 4 },
        pb: { xs: 2, sm: 4 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Pricing
        </Typography>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            xs={12}
            md={4}
            sm={tier.title === PriceTiers.Advanced ? 12 : 6}
            item
            key={tier.title}
          >
            <Card
              sx={{
                p: 2,
                minHeight: { xs: "", sm: "500px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border:
                  tier.title === PriceTiers.Professional
                    ? "1px solid"
                    : undefined,
                borderColor:
                  tier.title === PriceTiers.Professional
                    ? "primary.main"
                    : undefined,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.subheader && tier.title !== PriceTiers.Free && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === "light" ? "" : "none",
                        backgroundColor: "primary.contrastText",
                        marginLeft: 1,
                        "& .MuiChip-label": {
                          color: "primary.dark",
                        },
                        "& .MuiChip-icon": {
                          color: "primary.dark",
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  {tier.price && (
                    <>
                      <Typography component="h3" variant="h2">
                        ${tier.price}
                      </Typography>
                      <Typography component="h3" variant="h6">
                        &nbsp; per month
                      </Typography>
                    </>
                  )}
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: "grey.500",
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === PriceTiers.Professional
                            ? "primary.light"
                            : "primary.main",
                      }}
                    />
                    <Typography component="span" variant="subtitle2">
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>

              <CardActions>
                {tier.buttonAction && (
                  <Button
                    fullWidth
                    component="button"
                    disabled={tier.buttonDisabled}
                    variant={
                      tier.buttonVariant as "text" | "outlined" | "contained"
                    }
                    onClick={tier.buttonAction}
                  >
                    {tier.buttonText}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Pricing;
