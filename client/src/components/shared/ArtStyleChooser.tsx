import { Box, ButtonBase } from "@mui/material";

import { ArtStyles } from "src/shared/artStyles";
import { CheckRounded } from "@mui/icons-material";
import { FC } from "react";
import { honey400 } from "src/application/shared/themes";

export interface ArtStyleChooserProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "stacked" | "row";
}

/** Visual picker for the illustration art style (mirrors FormatChooser). */
const ArtStyleChooser: FC<ArtStyleChooserProps> = ({
  value,
  onChange,
  variant = "row",
}) => {
  const stacked = variant === "stacked";
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        pb: 1,
        gap: stacked ? "10px" : "12px",
      }}
    >
      {ArtStyles.map((style) => {
        const isSelected = value === style.id;

        return (
          <ButtonBase
            key={style.id}
            onClick={() => onChange(style.id)}
            sx={{
              flex: "0 0 auto",
              width: 160,
              textAlign: "left",
              minHeight: 150,
              backgroundColor: "background.paper",
              background: style.swatch,
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              borderWidth: isSelected ? 1.5 : 1,
              borderStyle: "solid",
              borderColor: isSelected ? honey400 : "divider",
              boxShadow: isSelected
                ? "0 0 0 4px rgba(240,182,72,0.18), var(--shadow-sm)"
                : "var(--shadow-xs)",
              display: "flex",
              alignItems: "stretch",
              position: "relative",
            }}
          >
            {style.thumbnail && (
              <Box
                component="img"
                src={style.thumbnail}
                alt={`${style.label} sample`}
                loading="lazy"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}

            {isSelected && (
              <CheckRounded
                sx={{
                  color: "#fff",
                  position: "absolute",
                  padding: 0.25,
                  top: 8,
                  right: 8,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: honey400,
                  zIndex: 1,
                }}
              />
            )}

            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "28px 12px 12px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 100%)",
              }}
            >
              <Box
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  lineHeight: 1.2,
                  color: "#fff",
                }}
              >
                {style.label}
              </Box>

              <Box
                sx={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: "2px",
                  lineHeight: 1.3,
                }}
              >
                {style.description}
              </Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default ArtStyleChooser;
