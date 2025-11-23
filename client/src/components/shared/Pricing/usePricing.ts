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
          (price: Price) => price.recurring?.interval === "month"
        )
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
        product.prices.find(
          (price: Price) => price.recurring?.interval === "year"
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
      case SubscriptionPlanEnum.Free:
        navigate(routes.create);
        return;

      case SubscriptionPlanEnum.Premium:
        try {
          handleIsFetching(true);
          const defaultPriceId = products.find((prod) => {
            const prodName = prod.name.toLocaleLowerCase();
            const planName = SubscriptionPlanEnum.Premium.toLocaleLowerCase();

            return prodName.includes(planName);
          })?.default_price;
          const currentPriceObject = prices.find(
            (price) => price.id === defaultPriceId
          );

          if (!defaultPriceId || !currentPriceObject) return;

          await handleCreateCheckoutSession(
            `${defaultPriceId}`,
            currentPriceObject,
            SubscriptionPlanEnum.Premium,
            user
          );
          handleIsFetching(false);
        } catch (error) {
          console.error("Error:>>", error);
        } finally {
          handleIsFetching(false);
          isPricingModalVisible && handleTogglePricingModal();
        }
        return;

      // case SubscriptionPlanEnum.Advanced:
      //   try {
      //     handleIsFetching(true);
      //     const defaultPriceId = products.find((prod) => {
      //       const prodName = prod.name.toLocaleLowerCase();
      //       const planName = SubscriptionPlanEnum.Premium.toLocaleLowerCase();
      //       return prodName.includes(planName);
      //     })?.default_price;
      //     const currentPriceObject = prices.find(
      //       (price) => price.id === defaultPriceId
      //     );

      //     if (!defaultPriceId || !currentPriceObject) return;

      //     await handleCreateCheckoutSession(
      //       `${defaultPriceId}`,
      //       currentPriceObject,
      //       SubscriptionPlanEnum.Advanced,
      //       user
      //     );
      //     handleIsFetching(false);
      //   } catch (error) {
      //     console.error("Error:>>", error);
      //   } finally {
      //     handleIsFetching(false);
      //     isPricingModalVisible && handleTogglePricingModal();
      //   }
      //   return;

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

      // case SubscriptionPlanEnum.advanced:
      //   if (!isAuthenticated) return "Register & Subscribe";
      //   if (currentUserPackage.isFree || currentUserPackage.isPremium)
      //     return "Upgrade";
      //   else return "Current Plan";

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
      product: getMonthlyPlan(SubscriptionPlanEnum.Premium),
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
    // {
    //   title: SubscriptionPlanEnum.advanced,
    //   subheader: "Coming Soon",
    //   features: [
    //     "Unlimited story generation",
    //     "Access to exclusive story content",
    //     "Offline access to stories",
    //     "Personalized story recommendations",
    //     "Premium text-to-speech voices",
    //     "Custom voice options for TTS",
    //   ],
    //   buttonDisabled: currentUserPackage.isAdvanced,
    //   buttonText: getButtonText(SubscriptionPlanEnum.advanced),
    //   buttonVariant: currentUserPackage.isPremium ? "contained" : "outlined",
    //   buttonAction: () => handleOnSubscribeClick(SubscriptionPlanEnum.advanced),
    // },
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
      product: getMonthlyPlan(SubscriptionPlanEnum.Premium),
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
  ];

  return {
    plans,
    plansForTable,
    prices,
    getPrice,
    getCurrency,
    getMonthlyPlan,
    getYearlyPlan,
  };
};
