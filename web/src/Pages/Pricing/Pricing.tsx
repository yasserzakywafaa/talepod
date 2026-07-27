import { Box, Container } from "@mui/material";

import BunnyHoldingMoneyBag from "src/assets/images/bunny_holding_money_bag.webp";
import Page from "src/components/shared/Page/Page";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import { routes } from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { usePricingContext } from "./store/Provider";
import { useTranslation } from "react-i18next";

const PricingPage = () => {
  const { t } = useTranslation("page");
  const {
    store: {
      state: { isFetching },
    },
  } = usePricingContext();

  const { isDesktop } = useDeviceSize();

  return (
    <Page
      title={t("pricing.pageTitle")}
      className="pricing-page"
      isLoading={isFetching}
      seo={{ description: t("pricing.subtitle"), segment: routes.pricing }}
    >
      <Box component="div" className="bg-image-character">
        <img
          src={BunnyHoldingMoneyBag}
          alt="bunny holding money bag"
          width="100%"
          height="100%"
        />
      </Box>

      <Container
        className="pricing-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        {isDesktop ? <PricingTable /> : <Pricing />}
      </Container>
    </Page>
  );
};

export default PricingPage;
