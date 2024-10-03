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
import PaymentWrapper from "./Payment/Payment";
import { SubscriptionPlanEnum } from "src/shared/user";
import Typography from "@mui/material/Typography";
import { useApplicationContext } from "src/application/store/Provider";
import { usePaymentContext } from "./Payment/store/Provider";
import { usePricingModalContext } from "../Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

export interface SubscriptionPlan {
  title: SubscriptionPlanEnum;
  subheader?: string;
  price: string;
  description: string[];
  buttonText: string;
  buttonVariant: string;
  buttonDisabled?: boolean;
  buttonAction?: () => void;
}

export const Pricing = () => {
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
      },
    },
    manager: { handleIsFetching },
  } = useApplicationContext();
  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  if (!user) return;

  const currentUserPackage = {
    isFree:
      user.subscription.subscriptionPlanType === SubscriptionPlanEnum.free,
    isPremium:
      user.subscription.subscriptionPlanType === SubscriptionPlanEnum.premium,
  };

  const {
    manager: { handleCreateCheckoutSession },
  } = usePaymentContext();

  const handleOnSubscribeClick = async (
    subscriptionPlan: SubscriptionPlanEnum
  ) => {
    switch (subscriptionPlan) {
      case SubscriptionPlanEnum.free:
        return;

      case SubscriptionPlanEnum.premium:
        if (!isAuthenticated) {
          handleToggleRegisterModal();
          return;
        }

        try {
          handleIsFetching(true);
          await handleCreateCheckoutSession(SubscriptionPlanEnum.premium, user);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          handleTogglePricingModal();
        }
        return;

      default:
        return;
    }
  };

  const plans: SubscriptionPlan[] = [
    {
      title: SubscriptionPlanEnum.free,
      price: "0",
      description: [
        "Standard customer support",
        "Create up to 4 bedtime stories",
        "Basic text-to-speech conversion",
        "Access to a limited story library",
      ],
      buttonText: currentUserPackage.isFree ? "Current Package" : "",
      buttonVariant: "text",
      buttonDisabled: true,
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.free),
    },
    {
      title: SubscriptionPlanEnum.premium,
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
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.premium),
    },
    // {
    //   title: SubscriptionPlanEnum.Advanced,
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
    <>
      <PaymentWrapper />

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
          {plans.map((plans) => (
            <Grid
              xs={12}
              md={4}
              sm={plans.title === SubscriptionPlanEnum.advanced ? 12 : 6}
              item
              key={plans.title}
            >
              <Card
                sx={{
                  p: 2,
                  minHeight: { xs: "", sm: "500px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border:
                    plans.title === SubscriptionPlanEnum.premium
                      ? "1px solid"
                      : undefined,
                  borderColor:
                    plans.title === SubscriptionPlanEnum.premium
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
                      {plans.title}
                    </Typography>
                    {plans.subheader &&
                      plans.title !== SubscriptionPlanEnum.free && (
                        <Chip
                          icon={<AutoAwesomeIcon />}
                          label={plans.subheader}
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
                    {plans.price && (
                      <>
                        <Typography component="h3" variant="h2">
                          ${plans.price}
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
                  {plans.description.map((line) => (
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
                            plans.title === SubscriptionPlanEnum.premium
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
                  {plans.buttonAction && (
                    <Button
                      fullWidth
                      component="button"
                      disabled={plans.buttonDisabled}
                      variant={
                        plans.buttonVariant as "text" | "outlined" | "contained"
                      }
                      onClick={plans.buttonAction}
                    >
                      {plans.buttonText}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
