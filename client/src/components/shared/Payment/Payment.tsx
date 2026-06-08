import { useEffect } from "react";
import { usePaymentContext } from "./store/Provider";

const PaymentWrapper = () => {
  const {
    manager: { setUp },
  } = usePaymentContext();

  useEffect(() => {
    setUp();
  }, []);

  return null;
};

export default PaymentWrapper;
