import { VerifiedTwoTone } from "@mui/icons-material";
import { secondaryColorForDarkTheme } from "src/application/shared/themes";

interface VerifiedBadge {
  fontSize?: number;
}

export const VerifiedBadge = (props: VerifiedBadge) => {
  return (
    <VerifiedTwoTone
      sx={{
        "& path:nth-of-type(1)": {
          color: secondaryColorForDarkTheme,
          fill: secondaryColorForDarkTheme,
          opacity: 1,
        },
        "& path:nth-of-type(2)": {
          color: secondaryColorForDarkTheme,
          fill: secondaryColorForDarkTheme,
          opacity: 1,
        },
        fontSize: props.fontSize || 14,
      }}
    />
  );
};
