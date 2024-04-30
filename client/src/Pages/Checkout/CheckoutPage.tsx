import "./Checkout.scss";

import Checkout from "src/components/Checkout/Checkout";
import Page from "src/components/shared/Page/Page";

const CheckoutPage = () => {
  return (
    <Page title="Checkout" className="checkout-page">
      <Checkout />
    </Page>
  );
};

export default CheckoutPage;
