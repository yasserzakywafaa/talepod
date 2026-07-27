import BillingToggle from "./BillingToggle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CheckCircleOutlined } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LoaderSpinner from "../Loader/LoaderSpinner";
import PayPerStoryCallout from "./PayPerStoryCallout";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import Typography from "@mui/material/Typography";
import characterLion from "src/assets/images/landing_pages/lion_cub.webp";
import mascotPuppy from "src/assets/images/cute_puppy_with_sparkling_eyes.webp";
import { usePaymentCatalog } from "../Payment/usePaymentCatalog";
import { usePricing } from "./usePricing";
import { useTranslation } from "react-i18next";
import { honey400, honey500 } from "src/application/shared/themes";

const planMascot = (title: SubscriptionPlanEnum) =>
  title === SubscriptionPlanEnum.Free ? mascotPuppy : characterLion;

export const Pricing = () => {
  const { t } = useTranslation("page");
  usePaymentCatalog();

  const {
    plans,
    prices,
    getCurrency,
    getDisplayPrice,
    billingInterval,
    setBillingInterval,
    isYearlyAvailable,
    getYearlySavingsPercent,
  } = usePricing();

  return (
    <Container
        id="pricing-cards"
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
          textAlign: "center",
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          color="primary"
          sx={{ fontFamily: "var(--font-display)" }}
        >
          {t("pricing.heroTitle")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {t("pricing.heroSubtitle")}
        </Typography>
      </Box>
      {isYearlyAvailable && (
        <BillingToggle
          value={billingInterval}
          onChange={setBillingInterval}
          savingsPercent={getYearlySavingsPercent()}
        />
      )}
      <Grid
        container
        spacing={3}
        sx={{
          alignItems: "stretch",
          justifyContent: "center",
          width: "100%"
        }}>
        {!prices.length && <LoaderSpinner position="absolute" />}

        {plans.map((plan) => {
          const isPremium = plan.title === SubscriptionPlanEnum.Premium;
          const display = getDisplayPrice(plan.product);

          return (
            <Grid
              size={{ xs: 12, md: plans.length >= 3 ? 4 : 6 }}
              key={plan.title}
            >
              <Card
                sx={{
                  height: "100%",
                  minHeight: { xs: "", sm: "500px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  position: "relative",
                  overflow: "hidden",
                  border: isPremium ? "2px solid" : "1px solid",
                  borderColor: isPremium ? "primary.main" : "divider",
                  boxShadow: isPremium
                    ? "var(--shadow-lg)"
                    : "var(--shadow-sm)",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1.25,
                      mb: 2
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25
                      }}>
                      <Box
                        component="img"
                        src={planMascot(plan.title)}
                        alt=""
                        sx={{ width: "15%", height: "auto", margin: 0 }}
                      />
                      <Typography
                        component="h3"
                        variant="h4"
                        sx={{ fontFamily: "var(--font-display)" }}
                      >
                        {plan.title}
                      </Typography>
                    </Box>

                    {isPremium && (
                      <Box sx={{ mb: 1.5 }}>
                        <Chip variant="badge" label={t("pricing.mostPopular")} />
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 0.5,
                    }}
                  >
                    {plan.product ? (
                      <>
                        {!display.billedYearly &&
                          plan.product.metadata?.monthly_discounted_price && (
                            <Typography
                              component="span"
                              variant="h6"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                mr: 0.5,
                              }}
                            >
                              {getCurrency(plan.title)}
                              {plan.product.metadata.monthly_discounted_price}
                            </Typography>
                          )}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "var(--font-display)",
                            fontSize: { xs: 40, sm: 48 },
                            lineHeight: 1,
                          }}
                        >
                          {getCurrency(plan.title)}
                          {display.amount}
                        </Typography>
                        <Typography component="span" variant="subtitle1">
                          {t("pricing.perMonth")}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: "var(--font-display)",
                          fontSize: { xs: 40, sm: 48 },
                          lineHeight: 1,
                        }}
                      >
                        {getCurrency(SubscriptionPlanEnum.Premium)}0
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mt: 0.5
                    }}>
                    {!plan.product
                      ? t("pricing.freeForever")
                      : display.billedYearly
                        ? t("pricing.billedYearly", {
                            currency: getCurrency(plan.title),
                            total: display.yearlyTotal,
                          })
                        : t("pricing.billedMonthly")}
                  </Typography>

                  <Divider
                    sx={{ my: 2, opacity: 0.2, borderColor: "grey.500" }}
                  />

                  {plan.features.map((feature) => (
                    <Box
                      key={feature}
                      sx={{
                        gap: 1.25,
                        py: 1,
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <CheckCircleOutlined
                        sx={{
                          fontSize: 18,
                          color: isPremium
                            ? honey400
                            : honey500,
                        }}
                      />
                      <Typography component="span" variant="subtitle2">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>

                <CardActions sx={{ p: 0, mt: 2 }}>
                  {plan.buttonAction && plan.buttonText && (
                    <Button
                      fullWidth
                      size="large"
                      component="button"
                      disabled={!!plan.buttonDisabled}
                      variant={plan.buttonVariant}
                      onClick={plan.buttonAction}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <PayPerStoryCallout />
    </Container>
  );
};
