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
import PaymentWrapper from "../Payment/Payment";
import { Product } from "src/shared/payment";
import { SubscriptionPlanEnum } from "src/shared/user";
import Typography from "@mui/material/Typography";
import { usePricing } from "./usePricing";

export interface SubscriptionPlanProps {
  title: SubscriptionPlanEnum;
  subheader?: string;
  product?: Product;
  description: string[];
  buttonText: string;
  buttonVariant: string;
  buttonDisabled?: boolean;
  buttonAction?: () => void;
}

export const Pricing = () => {
  const { plans, getPrice, getCurrency } = usePricing();

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
          {plans.map((plan) => (
            <Grid
              xs={12}
              md={4}
              sm={plan.title === SubscriptionPlanEnum.Advanced ? 12 : 6}
              item
              key={plan.title}
            >
              <Card
                sx={{
                  p: 2,
                  minHeight: { xs: "", sm: "500px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border:
                    plan.title === SubscriptionPlanEnum.Premium
                      ? "1px solid"
                      : undefined,
                  borderColor:
                    plan.title === SubscriptionPlanEnum.Premium
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
                      {plan.title}
                    </Typography>
                    {plan.subheader &&
                      plan.title !== SubscriptionPlanEnum.Free && (
                        <Chip
                          icon={<AutoAwesomeIcon />}
                          label={plan.subheader}
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
                    {plan.product ? (
                      <>
                        <Typography component="h3" variant="h2">
                          {getCurrency(plan.title)}
                          {getPrice(plan.product).monthly}
                        </Typography>
                        <Typography component="h3" variant="h6">
                          &nbsp; per month
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography component="h3" variant="h2">
                          {getCurrency(SubscriptionPlanEnum.Premium)}0
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
                        gap: 1.5,
                        paddingY: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          color:
                            plan.title === SubscriptionPlanEnum.Premium
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
                  {plan.buttonAction && plan.buttonText && (
                    <Button
                      fullWidth
                      component="button"
                      disabled={!!plan.buttonDisabled}
                      variant={
                        plan.buttonVariant as "text" | "outlined" | "contained"
                      }
                      onClick={plan.buttonAction}
                    >
                      {plan.buttonText}
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
