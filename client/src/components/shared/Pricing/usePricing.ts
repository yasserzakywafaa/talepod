import APP_CONSTANTS from "src/application/shared/app_constants";
import { Price } from "src/shared/types/payment";
import { Product } from "src/shared/types/payment";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";
import { usePaymentContext } from "../Payment/store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

export type BillingInterval = "month" | "year";

interface SubscriptionPlanProps {
  title: SubscriptionPlanEnum;
  subheader?: string;
  product?: Product;
  features: string[];
  buttonText: string;
  buttonDisabled?: boolean;
  buttonVariant: "text" | "outlined" | "contained";
  buttonAction?: () => void;
}

interface SubscriptionPlanTableProps {
  title: SubscriptionPlanEnum;
  subheader?: string;
  product?: Product;
  features: { [key: string]: string | number | boolean | undefined };
  buttonText: string;
  buttonDisabled?: boolean;
  buttonVariant: "text" | "outlined" | "contained";
  buttonAction?: () => void;
}

export const usePricing = () => {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const {
    store: {
      state: {
        auth: { user, isAuthenticated },
        userType: { isFreeUser, isPremiumUser },
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
    store: {
      state: { isVisible: isPricingModalVisible },
      handleTogglePricingModal,
    },
  } = usePricingModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const mapProductToMonthlyPlan = (plan: SubscriptionPlanEnum) => {
    const planName = plan.toLocaleLowerCase();

    const currentPlan = products.find((product) => {
      const productName = product.name.toLocaleLowerCase();
      if (
        productName.includes(planName) &&
        product.prices.find(
          (price: Price) => price.recurring?.interval === "month",
        )
      ) {
        return product;
      } else return;
    });

    return currentPlan;
  };

  const mapProductToYearlyPlan = (plan: SubscriptionPlanEnum) => {
    const planName = plan.toLocaleLowerCase();

    const currentPlan = products.find((product) => {
      if (
        product.name.toLocaleLowerCase().includes(planName) &&
        product.prices.find(
          (price: Price) => price.recurring?.interval === "year",
        )
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
        price.id === plan.default_price &&
        price.recurring?.interval === "month",
    )?.unit_amount;

    const yearlyPrice = prices.find(
      (price) =>
        price.id === plan.default_price && price.recurring?.interval === "year",
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
      (price) => price.id === getMonthlyPlan(plan)?.default_price,
    )?.currency;

    return getCurrencySymbol(currency);
  };

  // Resolve a product's price amount (major units) for an interval. Reads the
  // product's own price list first — a single Stripe product can carry both a
  // monthly and a yearly price, and `default_price` only points at one of them
  // — then falls back to the global price list keyed by product id.
  const findPrice = (
    product: Product | undefined,
    interval: BillingInterval,
  ): Price | undefined => {
    if (!product) return undefined;
    const fromProduct = product.prices?.find(
      (price) => price.recurring?.interval === interval,
    );
    if (fromProduct) return fromProduct;
    return prices.find((price) => {
      const productId =
        typeof price.product === "string" ? price.product : price.product?.id;
      return productId === product.id && price.recurring?.interval === interval;
    });
  };

  const findPriceAmount = (
    product: Product | undefined,
    interval: BillingInterval,
  ) => {
    const amount = findPrice(product, interval)?.unit_amount;
    return amount ? amount / 100 : 0;
  };

  // The product matching the currently-selected billing interval.
  const getPlanProduct = (plan: SubscriptionPlanEnum) =>
    billingInterval === "year" ? getYearlyPlan(plan) : getMonthlyPlan(plan);

  const premiumProduct =
    getMonthlyPlan(SubscriptionPlanEnum.Premium) ??
    getYearlyPlan(SubscriptionPlanEnum.Premium);

  // Only surface the yearly toggle when a yearly Premium price actually exists
  // in Stripe — keeps monthly-only environments unaffected.
  const isYearlyAvailable = findPriceAmount(premiumProduct, "year") > 0;

  // Surface the optional 3rd ("Advanced") tier only when its Stripe product
  // exists — the backend (enum, MAX_STORIES_LIMIT_ADVANCED, dynamic webhook)
  // is already wired, so adding the product lights this tier up automatically.
  const advancedProduct =
    getMonthlyPlan(SubscriptionPlanEnum.Advanced) ??
    getYearlyPlan(SubscriptionPlanEnum.Advanced);
  const isAdvancedAvailable = !!advancedProduct;

  // The headline price to render for a plan given the selected interval. For
  // yearly we show the per-month-equivalent (billed annually).
  const getDisplayPrice = (product?: Product) => {
    if (!product) return { amount: 0, billedYearly: false, yearlyTotal: 0 };
    if (billingInterval === "year") {
      const yearlyTotal = findPriceAmount(product, "year");
      const perMonth = yearlyTotal
        ? Math.round((yearlyTotal / 12) * 100) / 100
        : 0;
      return { amount: perMonth, billedYearly: true, yearlyTotal };
    }
    return {
      amount: findPriceAmount(product, "month"),
      billedYearly: false,
      yearlyTotal: 0,
    };
  };

  const getYearlySavingsPercent = () => {
    const monthly = findPriceAmount(premiumProduct, "month");
    const yearly = findPriceAmount(premiumProduct, "year");
    if (!monthly || !yearly) return 0;
    const percent = Math.round((1 - yearly / 12 / monthly) * 100);
    return percent > 0 ? percent : 0;
  };

  // Pay-per-story: a one-time (non-recurring) Stripe price, if configured.
  // The callout + buy action only surface when such a price exists.
  const oneTimePrice = prices.find(
    (price) => price.type === "one_time" && price.active !== false,
  );
  const isPayPerStoryAvailable = !!oneTimePrice;
  const getOneTimePrice = () =>
    oneTimePrice
      ? {
          amount: (oneTimePrice.unit_amount ?? 0) / 100,
          currency: getCurrencySymbol(oneTimePrice.currency),
        }
      : null;

  const handleBuyStory = async () => {
    if (!isAuthenticated) {
      handleToggleRegisterModal();
      return;
    }
    if (!oneTimePrice) return;

    try {
      handleIsFetching(true);
      await handleCreateCheckoutSession(
        oneTimePrice.id,
        oneTimePrice,
        SubscriptionPlanEnum.Free,
        user,
        { mode: "payment", credits: 1 },
      );
      handleIsFetching(false);
    } catch (error) {
      console.error("Error:>>", error);
    } finally {
      handleIsFetching(false);
      isPricingModalVisible && handleTogglePricingModal();
    }
  };

  const handleOnSubscribeClick = async (
    subscriptionPlan: SubscriptionPlanEnum,
  ) => {
    if (!isAuthenticated) {
      handleToggleRegisterModal();
      return;
    }

    switch (subscriptionPlan) {
      case SubscriptionPlanEnum.Free:
        navigate(routes.create);
        return;

      case SubscriptionPlanEnum.Premium:
      case SubscriptionPlanEnum.Advanced:
        try {
          handleIsFetching(true);
          // Check out the price matching the selected plan + billing interval.
          // A single Stripe product can carry both monthly and yearly prices,
          // so resolve by interval rather than trusting `default_price`.
          const selectedProduct = getPlanProduct(subscriptionPlan);
          const selectedPrice = findPrice(selectedProduct, billingInterval);
          const defaultPriceId = selectedPrice?.id;
          const currentPriceObject =
            prices.find((price) => price.id === defaultPriceId) ??
            selectedPrice;

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            subscriptionPlan,
            user,
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      default:
        return;
    }
  };

  const currentUserPackage = {
    isFree: user?.subscription.type === SubscriptionPlanEnum.Free,
    isPremium: user?.subscription.type === SubscriptionPlanEnum.Premium,
    isAdvanced: user?.subscription.type === SubscriptionPlanEnum.Advanced,
  };

  const getButtonText = (plan: SubscriptionPlanEnum) => {
    switch (plan) {
      case SubscriptionPlanEnum.Free:
        if (!isAuthenticated) return "Create Stories";
        if (currentUserPackage.isFree) return "Create Stories";
        else return "";

      case SubscriptionPlanEnum.Premium:
        if (!isAuthenticated) return "Register & Subscribe";
        if (!currentUserPackage.isPremium) return "Upgrade";
        else return "Current Plan";

      case SubscriptionPlanEnum.Advanced:
        if (!isAuthenticated) return "Register & Subscribe";
        if (!currentUserPackage.isAdvanced) return "Upgrade";
        else return "Current Plan";

      default:
        return "Upgrade";
    }
  };

  const plans: SubscriptionPlanProps[] = [
    {
      title: SubscriptionPlanEnum.Free,
      product: undefined,
      features: [
        "Standard customer support",
        "Create up to 4 bedtime stories",
        "Basic text-to-speech conversion",
        "Access to a limited story library",
      ],
      buttonDisabled: false,
      buttonText: getButtonText(SubscriptionPlanEnum.Free),
      buttonVariant: isAuthenticated ? "outlined" : "contained",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Free),
    },
    {
      title: SubscriptionPlanEnum.Premium,
      // subheader: "Recommended",
      product: getPlanProduct(SubscriptionPlanEnum.Premium),
      features: [
        "Priority customer support",
        "Customizable story parameters",
        "High-quality text-to-speech conversion",
        "Create up to 50 bedtime stories per month",
        "Access your Premium created stories",
      ],
      buttonDisabled: currentUserPackage.isPremium,
      buttonText: getButtonText(SubscriptionPlanEnum.Premium),
      buttonVariant: currentUserPackage.isFree ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Premium),
    },
    ...(isAdvancedAvailable
      ? [
          {
            title: SubscriptionPlanEnum.Advanced,
            subheader: "Best value",
            product: getPlanProduct(SubscriptionPlanEnum.Advanced),
            features: [
              "Everything in Premium",
              "Unlimited bedtime stories",
              "Priority story generation",
              "All storyteller voices",
              "Save unlimited stories in your library",
            ],
            buttonDisabled: currentUserPackage.isAdvanced,
            buttonText: getButtonText(SubscriptionPlanEnum.Advanced),
            buttonVariant: currentUserPackage.isAdvanced
              ? "outlined"
              : "contained",
            buttonAction: () =>
              handleOnSubscribeClick(SubscriptionPlanEnum.Advanced),
          } as SubscriptionPlanProps,
        ]
      : []),
  ];

  const plansForTable: SubscriptionPlanTableProps[] = [
    {
      title: SubscriptionPlanEnum.Free,
      product: undefined,
      features: {
        "Number of stories": APP_CONSTANTS.MAX_STORIES_LIMIT_FREE,
        "Story customization": false,
        "Visibility of Stories": "Public",
        "Customizable story parameters": false,
        "High-quality text-to-speech conversion": false,
        "Access your Premium created stories": false,
        "Customer support": "Standard",
      },
      buttonDisabled: false,
      buttonText: getButtonText(SubscriptionPlanEnum.Free),
      buttonVariant: isAuthenticated ? "outlined" : "contained",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Free),
    },
    {
      title: SubscriptionPlanEnum.Premium,
      subheader: "",
      product: getPlanProduct(SubscriptionPlanEnum.Premium),
      features: {
        "Number of stories": APP_CONSTANTS.MAX_STORIES_LIMIT_PREMIUM,
        "Story customization": true,
        "Visibility of Stories": "Public",
        "Customizable story parameters": true,
        "High-quality text-to-speech conversion": true,
        "Access your Premium created stories": true,
        "Customer support": "Priority",
      },
      buttonDisabled: isPremiumUser,
      buttonText: getButtonText(SubscriptionPlanEnum.Premium),
      buttonVariant: isFreeUser ? "contained" : "outlined",
      buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.Premium),
    },
    ...(isAdvancedAvailable
      ? [
          {
            title: SubscriptionPlanEnum.Advanced,
            subheader: "",
            product: getPlanProduct(SubscriptionPlanEnum.Advanced),
            features: {
              "Number of stories": "Unlimited",
              "Story customization": true,
              "Visibility of Stories": "Public",
              "Customizable story parameters": true,
              "High-quality text-to-speech conversion": true,
              "Access your Premium created stories": true,
              "Customer support": "Priority",
            },
            buttonDisabled: currentUserPackage.isAdvanced,
            buttonText: getButtonText(SubscriptionPlanEnum.Advanced),
            buttonVariant: currentUserPackage.isAdvanced
              ? "outlined"
              : "contained",
            buttonAction: () =>
              handleOnSubscribeClick(SubscriptionPlanEnum.Advanced),
          } as SubscriptionPlanTableProps,
        ]
      : []),
  ];

  return {
    plans,
    plansForTable,
    prices,
    getPrice,
    getCurrency,
    getMonthlyPlan,
    getYearlyPlan,
    billingInterval,
    setBillingInterval,
    isYearlyAvailable,
    isAdvancedAvailable,
    getDisplayPrice,
    getYearlySavingsPercent,
    isPayPerStoryAvailable,
    getOneTimePrice,
    handleBuyStory,
  };
};
