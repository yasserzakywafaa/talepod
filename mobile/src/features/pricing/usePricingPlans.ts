import { useState } from "react";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { mobileRoutes } from "src/application/routes";
import {
  navigateToCreateStory,
  openRootSheet,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { legalWebsiteUrl } from "src/components/legal/LegalTypography";
import { queryKeys } from "src/shared/api/queryKeys";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import type { Price, Product } from "src/shared/types/payment";

export type BillingInterval = "month" | "year";

export type PricingPlanCta = {
  /** Empty when the web hides the button altogether (paid user, free card). */
  label: string;
  disabled: boolean;
  variant: "contained" | "outlined";
  onPress: () => void;
};

export type PricingPlan = {
  title: SubscriptionPlanEnum;
  product?: Product;
  features: string[];
  /** Free is always available; the paid tiers only exist once Stripe has them. */
  isFree: boolean;
  cta: PricingPlanCta;
};

const fetchCatalog = async (): Promise<{
  products: Product[];
  prices: Price[];
}> => {
  const [productsResponse, pricesResponse] = await Promise.all([
    api.get<Product[]>(END_POINTS.PAYMENTS.GET_PRODUCTS_LIST_WITH_PRICES),
    api.get<Price[]>(END_POINTS.PAYMENTS.GET_PRICES_LIST),
  ]);
  return {
    products: Array.isArray(productsResponse.data)
      ? productsResponse.data
      : [],
    prices: Array.isArray(pricesResponse.data) ? pricesResponse.data : [],
  };
};

/** Subscribing and buying a single story both happen on the web. */
const PRICING_URL = `${legalWebsiteUrl}/pricing`;

/**
 * Read-only port of the web's `usePricing`: same plans, same button states,
 * same pay-per-story gating — but the app takes no payment, so a purchase
 * hands off to talepod.com instead of opening a Stripe Checkout session.
 */
export const usePricingPlans = () => {
  const { t } = useTranslation("page");
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const isAuthenticated = auth.isAuthenticated;
  const subscriptionType = auth.user?.subscription.type;
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");

  const query = useQuery({
    queryKey: queryKeys.pricing.plans("default"),
    queryFn: fetchCatalog,
    // A missing catalogue still renders the plans, just without prices —
    // not worth retrying a genuinely-empty Stripe catalogue over.
    retry: false,
  });

  const products = query.data?.products ?? [];
  const prices = query.data?.prices ?? [];
  const isLoading = query.isPending;

  const findProduct = (plan: SubscriptionPlanEnum, interval: BillingInterval) =>
    products.find(
      (product) =>
        product.name?.toLocaleLowerCase().includes(plan.toLocaleLowerCase()) &&
        product.prices?.some((price) => price.recurring?.interval === interval),
    );

  // One product can carry monthly and yearly prices while `default_price`
  // points at only one, so resolve by interval first.
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

  const getPlanProduct = (plan: SubscriptionPlanEnum) =>
    findProduct(plan, billingInterval) ??
    findProduct(plan, "month") ??
    findProduct(plan, "year");

  const premiumProduct = getPlanProduct(SubscriptionPlanEnum.Premium);
  const advancedProduct = getPlanProduct(SubscriptionPlanEnum.Advanced);

  const isYearlyAvailable = findPriceAmount(premiumProduct, "year") > 0;

  // The Free plan has no product, so — as on the web — its "0" borrows the
  // Premium currency rather than falling back to a default symbol.
  const getCurrency = (product?: Product) =>
    getCurrencySymbol(
      findPrice(product ?? premiumProduct, billingInterval)?.currency ??
        findPrice(premiumProduct, "month")?.currency,
    );

  /** Headline price: for yearly, the per-month equivalent billed annually. */
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
  // Same self-gating as the web — the callout stays hidden until one exists.
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

  const currentUserPackage = {
    isFree: subscriptionType === SubscriptionPlanEnum.Free,
    isPremium: subscriptionType === SubscriptionPlanEnum.Premium,
    isAdvanced: subscriptionType === SubscriptionPlanEnum.Advanced,
  };

  /**
   * The web opens a Register modal for guests and a Stripe Checkout session
   * for everyone else. The app takes no payment, so a subscribe tap hands off
   * to talepod.com; the guest path becomes the register sheet.
   */
  const handleRegister = () => openRootSheet(mobileRoutes.public.register);
  const openCheckoutOnWeb = () => {
    void Linking.openURL(PRICING_URL);
  };

  const handleOnSubscribeClick = (plan: SubscriptionPlanEnum) => {
    if (!isAuthenticated) {
      handleRegister();
      return;
    }

    if (plan === SubscriptionPlanEnum.Free) {
      navigateToCreateStory();
      return;
    }

    openCheckoutOnWeb();
  };

  const handleBuyStory = () => {
    if (!isAuthenticated) {
      handleRegister();
      return;
    }
    openCheckoutOnWeb();
  };

  /** Verbatim port of the web `usePricing().getButtonText`. */
  const getButtonText = (plan: SubscriptionPlanEnum) => {
    switch (plan) {
      case SubscriptionPlanEnum.Free:
        if (!isAuthenticated) return t("pricing.cta.createStories");
        if (currentUserPackage.isFree) return t("pricing.cta.createStories");
        return "";

      case SubscriptionPlanEnum.Premium:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (!currentUserPackage.isPremium) return t("pricing.cta.upgrade");
        return t("pricing.cta.currentPlan");

      case SubscriptionPlanEnum.Advanced:
        if (!isAuthenticated) return t("pricing.cta.registerSubscribe");
        if (!currentUserPackage.isAdvanced) return t("pricing.cta.upgrade");
        return t("pricing.cta.currentPlan");

      default:
        return t("pricing.cta.upgrade");
    }
  };

  const plans: PricingPlan[] = [
    {
      title: SubscriptionPlanEnum.Free,
      isFree: true,
      features: [
        t("pricing.features.standardSupport"),
        t("pricing.features.createUpToFree", {
          count: APP_CONSTANTS.MAX_STORIES_LIMIT_FREE,
        }),
        t("pricing.features.basicTts"),
        t("pricing.features.limitedLibrary"),
      ],
      cta: {
        label: getButtonText(SubscriptionPlanEnum.Free),
        disabled: false,
        variant: isAuthenticated ? "outlined" : "contained",
        onPress: () => handleOnSubscribeClick(SubscriptionPlanEnum.Free),
      },
    },
    {
      title: SubscriptionPlanEnum.Premium,
      isFree: false,
      product: premiumProduct,
      features: [
        t("pricing.features.prioritySupport"),
        t("pricing.features.customizableParams"),
        t("pricing.features.highQualityTts"),
        t("pricing.features.createUpToMonthly", {
          count: APP_CONSTANTS.MAX_STORIES_LIMIT_PREMIUM,
        }),
        t("pricing.features.accessPremiumStories"),
      ],
      cta: {
        label: getButtonText(SubscriptionPlanEnum.Premium),
        disabled: currentUserPackage.isPremium,
        variant: currentUserPackage.isFree ? "contained" : "outlined",
        onPress: () => handleOnSubscribeClick(SubscriptionPlanEnum.Premium),
      },
    },
    // The Advanced tier only exists once its Stripe product does — same
    // self-gating the web uses, so adding the product lights it up here too.
    ...(advancedProduct
      ? [
          {
            title: SubscriptionPlanEnum.Advanced,
            isFree: false,
            product: advancedProduct,
            features: [
              t("pricing.features.everythingInPremium"),
              t("pricing.features.unlimitedStories"),
              t("pricing.features.priorityGeneration"),
              t("pricing.features.allVoices"),
              t("pricing.features.unlimitedLibrary"),
            ],
            cta: {
              label: getButtonText(SubscriptionPlanEnum.Advanced),
              disabled: currentUserPackage.isAdvanced,
              variant: currentUserPackage.isAdvanced
                ? "outlined"
                : "contained",
              onPress: () =>
                handleOnSubscribeClick(SubscriptionPlanEnum.Advanced),
            },
          } as PricingPlan,
        ]
      : []),
  ];

  return {
    plans,
    isLoading,
    billingInterval,
    setBillingInterval,
    isYearlyAvailable,
    getCurrency,
    getDisplayPrice,
    getYearlySavingsPercent,
    isAdvancedAvailable: !!advancedProduct,
    isPayPerStoryAvailable,
    getOneTimePrice,
    handleBuyStory,
  };
};
