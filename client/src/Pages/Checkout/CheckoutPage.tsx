import "./Checkout.scss";

import Checkout from "src/components/Checkout/Checkout";
import Page from "src/components/shared/Page/Page";

const CheckoutPage = () => {
  return (
    <>
      <div className="background-layer checkout-page">
        <Page title="Checkout">
          <Checkout />
        </Page>
      </div>
    </>
  );
};

export default CheckoutPage;
