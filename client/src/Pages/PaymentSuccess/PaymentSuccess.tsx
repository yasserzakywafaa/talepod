import "./PaymentSuccess.scss";

import { AutoFixHighOutlined, PersonOutlined } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import BunnyMoney from "src/assets/images/bunny_holding_money_bag.webp";
import Confetti from "src/assets/images/confetti.gif";
import Page from "src/components/shared/Page/Page";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { usePaymentSuccessContext } from "./store/Provider";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const {
    store: {
      state: { isFetching, paymentSessionData },
    },
    manager: { handleGetPaymentSuccessData },
  } = usePaymentSuccessContext();
  const { status, payment_status, amount_total, currency } = paymentSessionData;

  if (!sessionId) return;

  const handleOnCreateClick = () => navigate(routes.create);
  const handleOnMyProfileClick = () =>
    auth.user && navigate(routes.myProfile(auth.user._id));

  const totalAmount = `${getCurrencySymbol(currency)}${(
    amount_total / 100
  ).toFixed(2)}`;

  useEffect(() => {
    handleGetPaymentSuccessData(sessionId);
  }, []);

  // useEffect(() => {
  //   // handleUpdateUserInfoAfterPayment(sessionId);
  // }, [paymentSessionData]);

  if (!auth.user || status !== "complete" || payment_status !== "paid")
    return <></>;

  return (
    <Page
      title="Payment Success | TalePod"
      className="payment-success-page"
      isLoading={isFetching}
    >
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
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={BunnyMoney}
            width="100%"
            className="payment-success-character-image"
          />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginY={1}
          >
            <Typography variant="h4" component="h2" color="#2e7d32">
              Payment Successful
            </Typography>
          </Box>
        </Box>

        <Box
          marginY={1}
          display="flex"
          component="div"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography variant="h5" textAlign="center">
            Hooray, {auth.user.name.givenName}! 🎉 <br />
            Your payment process of <b>{totalAmount}</b> has been completed
            successfully!
          </Typography>

          <Box
            marginY={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Button
              sx={{ margin: "0.5rem" }}
              size="large"
              type="button"
              variant="contained"
              endIcon={<AutoFixHighOutlined />}
              onClick={handleOnCreateClick}
            >
              Create more stories
            </Button>

            <Button
              sx={{ margin: "0.5rem" }}
              size="large"
              type="button"
              color="secondary"
              variant="outlined"
              endIcon={<PersonOutlined />}
              onClick={handleOnMyProfileClick}
            >
              My Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </Page>
  );
};

export default PaymentSuccessPage;
