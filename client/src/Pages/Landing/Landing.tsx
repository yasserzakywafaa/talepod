import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hero from "./features/Hero";
import LogoCollection from "./features/LogoCollection";
import Highlights from "./features/Highlights";
import Pricing from "./features/Pricing";
import Features from "./features/Features";
import Testimonials from "./features/Testimonials";
import FAQ from "./features/FAQ";
import Footer from "./features/Footer";
import Page from "src/components/shared/Page/Page";

export default function LandingPage() {
  return (
    <Page title="AI Story Creator" className="home-page">
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <LogoCollection />
        
        <Features />

        <Divider />

        <Testimonials />

        <Divider />

        <Highlights />

        <Divider />

        <Pricing />

        <Divider />

        <FAQ />

        <Divider />

        <Footer />
      </Box>
    </Page>
  );
}
