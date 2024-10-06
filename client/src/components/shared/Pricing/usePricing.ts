import { Product } from "src/shared/payment";
import { SubscriptionPlanEnum } from "src/shared/user";
import { SubscriptionPlanProps } from "./Pricing";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import { useApplicationContext } from "src/application/store/Provider";
import { usePaymentContext } from "../Payment/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

export const usePricing = () => {
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
      },
    },
    manager: { handleIsFetching },
  } = useApplicationContext();

  const {
    store: {
      state: { products, prices },
    },
    manager: { handleCreateCheckoutSession },
  } = usePaymentContext();

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const mapProductToMonthlyPlan = (plan: SubscriptionPlanEnum) => {
    const currentPlan = products.find((product) => {
      if (
        product.name.toLocaleLowerCase().includes(plan) &&
        product.prices.find((price) => price.recurring?.interval === "month")
      ) {
        return product;
      } else return;
    });

    return currentPlan;
  };

  const mapProductToYearlyPlan = (plan: SubscriptionPlanEnum) => {
    const currentPlan = products.find((product) => {
      if (
        product.name.toLocaleLowerCase().includes(plan) &&
        product.prices.find((price) => price.recurring?.interval === "year")
      ) {
        return product;
      } else return;
    });

    return currentPlan;
  };

  const getMonthlyPlan = (plan: SubscriptionPlanEnum) => {
    return mapProductToMonthlyPlan(plan);
  };

  const getYearlyPlan = (plan: SubscriptionPlanEnum) => {
    return mapProductToYearlyPlan(plan);
  };

  const getPrice = (plan: Product) => {
    const monthlyPrice = prices.find(
      (price) =>
        price.id === plan.default_price && price.recurring?.interval === "month"
    )?.unit_amount;

    const yearlyPrice = prices.find(
      (price) =>
        price.id === plan.default_price && price.recurring?.interval === "year"
    )?.unit_amount;

    const monthly = monthlyPrice ? monthlyPrice / 100 : 0;
    const yearly = yearlyPrice ? yearlyPrice / 100 : 0;

    return {
      monthly,
      yearly,
    };
  };

  const getCurrency = (plan: SubscriptionPlanEnum) => {
    const currency = prices.find(
      (price) => price.id === getMonthlyPlan(plan)?.default_price
    )?.currency;

    return getCurrencySymbol(currency);
  };

  const handleOnSubscribeClick = async (
    subscriptionPlan: SubscriptionPlanEnum
  ) => {
    if (!isAuthenticated) {
      handleToggleRegisterModal();
      return;
    }

    switch (subscriptionPlan) {
      case SubscriptionPlanEnum.free:
        return;

      case SubscriptionPlanEnum.premium:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) =>
            prod.name.toLocaleLowerCase().includes(SubscriptionPlanEnum.premium)
          )?.default_price;

          if (!defaultPriceId) throw new Error();

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            SubscriptionPlanEnum.premium,
            user
          );
          handleIsFetching(false);
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

  const currentUserPackage = {
    isFree: user?.subscription.type === SubscriptionPlanEnum.free,
    isPremium: user?.subscription.type === SubscriptionPlanEnum.premium,
  };

  const plans: SubscriptionPlanProps[] = [
    {
      title: SubscriptionPlanEnum.free,
      product: undefined,
      description: [
        "Standard customer support",
        "Create up to 4 bedtime stories",
        "Basic text-to-speech conversion",
        "Access to a limited story library",
      ],
      buttonText: currentUserPackage.isFree ? "Current Package" : "Default",
      buttonVariant: "text",
      buttonDisabled: true,
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.free),
    },
    {
      title: SubscriptionPlanEnum.premium,
      // subheader: "Recommended",
      product: getMonthlyPlan(SubscriptionPlanEnum.premium),
      description: [
        "Priority customer support",
        "Customizable story parameters",
        "High-quality text-to-speech conversion",
        "Create up to 50 bedtime stories per month",
      ],
      buttonText: isAuthenticated ? "Upgrade" : "Register & Subscribe",
      buttonVariant: "contained",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.premium),
    },
    // {
    //   title: SubscriptionPlanEnum.Advanced,
    //   subheader: "Coming Soon",
    //   price: planPrices.premium ? planPrices.premium / 100 : 10,
    // currency: "",
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

  return {
    plans,
    getPrice,
    getCurrency,
    getMonthlyPlan,
    getYearlyPlan,
  };
};
