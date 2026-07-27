import "./FeaturesPage.scss";

import Benefits from "./features/Benefits";
import CallToAction from "./features/CallToAction";
import { Divider, Link as MuiLink } from "@mui/material";
import FAQ from "./features/FAQ";
import Guarantee from "./features/Guarantee";
import Hero from "./features/Hero";
import HowItWorks from "./features/HowItWorks";
import KeyFeatures from "./features/KeyFeatures";
import { LoaderComponentNameEnum } from "src/components/shared/Loader/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import {
  homepageFaqItems,
  safetyFaqItems,
} from "src/shared/content/faqContent";
import {
  createFAQPageSchema,
  createOrganizationSchemaForSite,
  createSoftwareApplicationSchema,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";
import PersonalizedBedtimeStoryText from "./features/PersonalizedBedtimeStoryText";
import { Pricing } from "src/components/shared/Pricing/Pricing";
import PricingTable from "src/components/shared/Pricing/PricingTable";
import StoryExamples from "./features/StoryExamples";
import StoryFormats from "./features/StoryFormats";
import Testimonials from "./features/Testimonials";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";
import { routes } from "src/application/routes";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useLocaleContext,
  useLocalizedPath,
} from "@yasserzakywafaa/client-core/web/i18n";

const FeaturesPage = () => {
  const { t } = useTranslation("landing");
  const { locale } = useLocaleContext();
  const localizedPath = useLocalizedPath();
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const {
    store: {
      state: {
        createStory: { isFetching: isCreateStoryFetching },
      },
    },
  } = useOpenaiContext();

  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(locale),
    [locale],
  );
  const softwareApplicationSchema = useMemo(
    () => createSoftwareApplicationSchema(),
    [],
  );
  const faqSchema = useMemo(
    () =>
      createFAQPageSchema(
        [...homepageFaqItems, ...safetyFaqItems],
        localizedPath(routes.features),
      ),
    [localizedPath],
  );

  useSchemaOrg(organizationSchema, "organization-schema");
  useSchemaOrg(softwareApplicationSchema, "software-application-schema");
  useSchemaOrg(faqSchema, "faq-page-schema");

  return (
    <Page
      title={t("features.pageTitle")}
      className="features-page"
      isLoading={isFetching || isCreateStoryFetching}
      loaderComponentName={
        isCreateStoryFetching ? LoaderComponentNameEnum.CreateStory : undefined
      }
      seo={{
        description: t("seo.home.description"),
        segment: routes.features,
      }}
    >
      <Hero />

      <MuiLink
        component={Link}
        to={localizedPath(routes.landingPages.personalizedBedtimeStoryGenerator)}
        sx={{
          display: "block",
          textAlign: "center",
          mb: 2,
          fontSize: 14,
        }}
      >
        {t("features.generatorLink")}
      </MuiLink>

      <div className="section">
        <StoryFormats />
      </div>

      <div className="section">
        <Testimonials />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <PersonalizedBedtimeStoryText />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <KeyFeatures />
      </div>

      <Divider sx={{ width: "50%" }} />

      <Divider sx={{ width: "50%" }} />

      <div className="section" id="how-it-works">
        <HowItWorks />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <StoryExamples />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <Benefits />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        {isDesktop && <PricingTable />}
        {(isTablet || isMobile) && <Pricing />}
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <Guarantee />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <CallToAction />
      </div>

      <Divider sx={{ width: "50%" }} />

      <div className="section">
        <FAQ />
      </div>
    </Page>
  );
};

export default FeaturesPage;
