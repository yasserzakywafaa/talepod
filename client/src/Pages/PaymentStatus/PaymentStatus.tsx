import "./PaymentStatus.scss";

import { AutoFixHighOutlined, PersonOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import BunnyMoney from "src/assets/images/bunny_holding_money_bag.webp";
import Confetti from "src/assets/images/confetti.gif";
import Page from "src/components/shared/Page/Page";
import {
  formatLocalizedDate,
  getCurrencySymbol,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";
import { Trans, useTranslation } from "react-i18next";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { usePaymentStatusContext } from "./store/Provider";

const PaymentStatusPage = () => {
  const { t, i18n } = useTranslation("page");
  const locale = localeFromLanguage(i18n.language);
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const {
    store: {
      state: { isFetching, sessionData, showPaymentSuccess },
    },
    manager: { handleGetPaymentStatusData },
  } = usePaymentStatusContext();

  if (!sessionId || !auth.user) {
    console.log("❌ PaymentStatusPage:>>> 'sessionId' or 'User' is required!", {
      sessionId,
      user: auth.user,
    });
    alert("❌ 'sessionId' or 'User' is required!");

    return;
  }

  const getTotalAmount = (): string => {
    if (!sessionData) return "0";

    return `${getCurrencySymbol(sessionData.currency)}${
      sessionData.amount_total / 100
    }`;
  };

  const isStoryCredit = sessionData.mode === "payment";
  const storyCredits = auth.user.storyCredits ?? 1;

  const handleOnCreateClick = () => navigate(routes.create);
  const handleOnMyProfileClick = () =>
    auth.user && navigate(routes.myProfile(auth.user._id));

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        await handleGetPaymentStatusData(sessionId);
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    if (!showPaymentSuccess) {
      intervalId = setInterval(checkPaymentStatus, 1000);
    }

    return () => clearInterval(intervalId);
  }, [sessionId, showPaymentSuccess]);

  return (
    <Page
      title={t("paymentStatus.pageTitle")}
      className={`payment-status-page ${
        showPaymentSuccess ? "payment-success" : ""
      }`}
      isLoading={isFetching}
    >
      {!showPaymentSuccess ? (
        <>
          <Container className="payment-status-container" sx={{ paddingY: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="primary" size="10rem" />
              <Typography
                variant="h4"
                sx={{
                  marginTop: 8,
                }}
              >
                {t("paymentStatus.processing")}
              </Typography>
            </Box>
          </Container>
        </>
      ) : (
        <>
          <img
            src={Confetti}
            alt="Confetti"
            width="100%"
            height="100%"
            className="payment-success-confetti-image"
          />

          <Container
            className="payment-success-container"
            sx={{
              pt: 4,
              pb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={BunnyMoney}
                width="100%"
                className="payment-success-character-image"
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginY: 1,
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "#2e7d32",
                  }}
                >
                  {t("paymentStatus.successTitle")}
                </Typography>
              </Box>
            </Box>

            <Box
              component="div"
              sx={{
                marginY: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginY: 1,
                  textAlign: "center",
                }}
              >
                <Trans
                  t={t}
                  i18nKey="paymentStatus.successMessage"
                  values={{
                    name: auth.user.name.givenName,
                    amount: getTotalAmount(),
                  }}
                  components={{
                    br: <br />,
                    bold: <span className="bold" />,
                  }}
                />
              </Typography>

              {isStoryCredit ? (
                <Typography
                  variant="h6"
                  sx={{
                    marginY: 1,
                    textAlign: "center",
                  }}
                >
                  <Trans
                    t={t}
                    i18nKey="paymentStatus.storyCreditAdded"
                    count={storyCredits}
                    values={{ count: storyCredits }}
                    components={{ b: <b /> }}
                  />
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    color="primary"
                    className="bold"
                    sx={{
                      marginY: 1,
                      textAlign: "center",
                    }}
                  >
                    {sessionData.subscription?.plan.nickname}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      marginY: 1,
                      textAlign: "center",
                    }}
                  >
                    <Trans
                      t={t}
                      i18nKey="paymentStatus.subscriptionEnd"
                      values={{
                        date: formatLocalizedDate(
                          new Date(auth.user.subscription.endDate || ""),
                          locale,
                          { dateStyle: "short" },
                        ),
                      }}
                      components={{ b: <b /> }}
                    />
                  </Typography>
                </>
              )}

              <Box
                sx={{
                  marginY: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  color="secondary"
                  variant="outlined"
                  endIcon={<PersonOutlined />}
                  onClick={handleOnMyProfileClick}
                >
                  {t("paymentStatus.goToProfile")}
                </Button>

                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  variant="contained"
                  endIcon={<AutoFixHighOutlined />}
                  onClick={handleOnCreateClick}
                >
                  {isStoryCredit
                    ? t("paymentStatus.createStory")
                    : t("paymentStatus.createPremiumStories")}
                </Button>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Page>
  );
};

export default PaymentStatusPage;
