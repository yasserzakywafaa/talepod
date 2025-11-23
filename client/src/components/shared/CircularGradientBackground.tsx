import {
  primaryColor,
  secondaryColorForDarkTheme,
} from "src/application/shared/themes";

import { Box } from "@mui/material";

interface CircularGradientBackgroundProps {
  /**
   * Position of the gradient center
   * @default "bottom"
   */
  position?: "top" | "bottom" | "center";
  /**
   * Primary color opacity (0-1)
   * @default 0.6
   */
  primaryOpacity?: number;
  /**
   * Secondary color opacity (0-1)
   * @default 0.15
   */
  secondaryOpacity?: number;
  /**
   * Custom z-index
   * @default -1
   */
  zIndex?: number;
}

const CircularGradientBackground = ({
  position = "bottom",
  primaryOpacity = 0.6,
  secondaryOpacity = 0.15,
  zIndex = -1,
}: CircularGradientBackgroundProps) => {
  // Convert position to percentage
  const positionMap = {
    top: "0%",
    center: "50%",
    bottom: "100%",
  };

  const positionValue = positionMap[position];

  // Extract RGB values from hex colors
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColorForDarkTheme);

  return (
    <>
      {/* Primary circular gradient glow */}
      <Box
        className="primary-circular-gradient-glow"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          background: `radial-gradient(circle at 50% ${positionValue}, 
            rgba(${primaryRgb.r}, ${primaryRgb.g}, ${
            primaryRgb.b
          }, ${primaryOpacity}) 0%, 
            rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${
            primaryOpacity * 0.5
          }) 20%,
            rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${
            primaryOpacity * 0.17
          }) 40%,
            transparent 70%
          )`,
          pointerEvents: "none",
        }}
      />
      {/* Secondary circular accent */}
      <Box
        className="secondary-circular-gradient-accent"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          background: `radial-gradient(ellipse 100% 60% at 50% ${positionValue}, 
            rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${secondaryOpacity}) 0%, 
            transparent 50%
          )`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 142, g: 69, b: 133 }; // Default to primary color
};

export default CircularGradientBackground;
