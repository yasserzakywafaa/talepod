import { useMediaQuery, useTheme } from "@mui/material";

const useDeviceSize = () => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return {
    isDesktop,
    isTablet,
    isMobile,
  };
};

export default useDeviceSize;
