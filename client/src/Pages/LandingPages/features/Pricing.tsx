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
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { SubscriptionPlanEnum } from "src/shared/user";

const subscriptionPlans = [
  {
    title: SubscriptionPlanEnum.free,
    price: "0",
    description: [
      "Create up to 7 bedtime stories",
      "Basic text-to-speech conversion",
      "Access to a limited story library",
      "Standard customer support",
      // "Community forum access",
    ],
    buttonText: "Register for free",
    buttonVariant: "outlined",
  },
  {
    title: SubscriptionPlanEnum.premium,
    subheader: "Recommended",
    price: "5",
    description: [
      "Create up to 50 bedtime stories per month",
      "High-quality text-to-speech conversion",
      "Access to an extensive story library",
      "Priority customer support",
      "Offline access to stories",
      "Customizable story parameters",
    ],
    buttonText: "Start now",
    buttonVariant: "contained",
  },
  {
    title: SubscriptionPlanEnum.advanced,
    subheader: "Coming Soon",
    price: "",
    description: [
      "Unlimited story generation",
      "Access to exclusive story content",
      "Offline access to stories",
      "Personalized story recommendations",
      "Premium text-to-speech voices",
      "Custom voice options for TTS",
    ],
    buttonText: "Start now",
    buttonVariant: "outlined",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography variant="body1" color="text.secondary">
          Quickly build an effective pricing table for your potential customers
          with this layout. <br />
          It&apos;s built with default Material UI components with little
          customization.
        </Typography>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {subscriptionPlans.map((plan) => (
          <Grid
            item
            key={plan.title}
            xs={12}
            sm={plan.title === SubscriptionPlanEnum.advanced ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                border:
                  plan.title === SubscriptionPlanEnum.premium
                    ? "1px solid"
                    : undefined,
                borderColor:
                  plan.title === SubscriptionPlanEnum.premium
                    ? "primary.main"
                    : undefined,
                background:
                  plan.title === SubscriptionPlanEnum.premium
                    ? "linear-gradient(#033363, #021F3B)"
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
                    color:
                      plan.title === SubscriptionPlanEnum.premium
                        ? "grey.100"
                        : "",
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {plan.title}
                  </Typography>
                  {plan.title !== SubscriptionPlanEnum.free && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={plan.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === "light" ? "" : "none",
                        backgroundColor: "primary.contrastText",
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
                    color:
                      plan.title === SubscriptionPlanEnum.premium
                        ? "grey.50"
                        : undefined,
                  }}
                >
                  {plan.price && (
                    <>
                      <Typography component="h3" variant="h2">
                        ${plan.price}
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
                {plan.description.map((line) => (
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
                          plan.title === SubscriptionPlanEnum.premium
                            ? "primary.light"
                            : "primary.main",
                      }}
                    />
                    <Typography
                      component="text"
                      variant="subtitle2"
                      sx={{
                        color:
                          plan.title === SubscriptionPlanEnum.premium
                            ? "grey.200"
                            : undefined,
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  component="button"
                  variant={plan.buttonVariant as "outlined" | "contained"}
                  onClick={() =>
                    plan.title === SubscriptionPlanEnum.free
                      ? handleToggleRegisterModal()
                      : navigate(routes.checkout)
                  }
                >
                  {plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Pricing;
