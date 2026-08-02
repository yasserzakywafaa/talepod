import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { queryKeys } from "src/shared/api/queryKeys";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import type { Price, Product } from "src/shared/types/payment";

export type BillingInterval = "month" | "year";

export type PricingPlan = {
  title: SubscriptionPlanEnum;
  product?: Product;
  features: string[];
  /** Free is always available; the paid tiers only exist once Stripe has them. */
  isFree: boolean;
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

/**
 * Read-only port of the web's `usePricing`: the app takes no payment, it
 * renders the prices and hands off to talepod.com to subscribe.
 */
export const usePricingPlans = () => {
  const { t } = useTranslation("page");
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

  const getCurrency = (product?: Product) =>
    getCurrencySymbol(findPrice(product, billingInterval)?.currency);

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
  };
};
