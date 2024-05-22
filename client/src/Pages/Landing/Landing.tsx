import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import AppAppBar from "./features/AppAppBar";
import Hero from "./features/Hero";
import LogoCollection from "./features/LogoCollection";
import Highlights from "./features/Highlights";
import Pricing from "./features/Pricing";
import Features from "./features/Features";
import Testimonials from "./features/Testimonials";
import FAQ from "./features/FAQ";
import Footer from "./features/Footer";
import { useState } from "react";

export default function LandingPage() {
  const [mode, setMode] = useState<PaletteMode>("light");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
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
    </>
  );
}
